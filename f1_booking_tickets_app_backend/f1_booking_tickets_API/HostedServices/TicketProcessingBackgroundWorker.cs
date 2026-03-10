using System.Text.Json;
using f1_booking_tickets.Domain.Entities;
using f1_booking_tickets.Domain.Events;
using f1_booking_tickets.Services.If;
using f1_booking_tickets_API.Configuration;
using f1_booking_tickets_API.Messages;
using StackExchange.Redis;

namespace f1_booking_tickets_API.HostedServices
{
    public class TicketProcessingBackgroundWorker : BackgroundService
    {
        private readonly IServiceScopeFactory _serviceScopeFactory;
        private readonly ILogger<TicketProcessingBackgroundWorker> _logger;
        private readonly ISubscriber _subscriber;

        public TicketProcessingBackgroundWorker(
            IConnectionMultiplexer connectionMultiplexer,
            IServiceScopeFactory serviceScopeFactory,
            ILogger<TicketProcessingBackgroundWorker> logger)
        {
            _serviceScopeFactory = serviceScopeFactory;
            _logger = logger;
            _subscriber = connectionMultiplexer.GetSubscriber();
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            _logger.LogInformation("Ticket Processing Background Worker started");

            await _subscriber.SubscribeAsync(
                RedisChannel.Literal(RedisQueueNames.TicketPurchaseQueue),
                async (channel, message) => await ProcessTicketPurchaseAsync(message));

            await _subscriber.SubscribeAsync(
                RedisChannel.Literal(RedisQueueNames.TicketModificationQueue),
                async (channel, message) => await ProcessTicketModificationAsync(message));

            await _subscriber.SubscribeAsync(
                RedisChannel.Literal(RedisQueueNames.TicketCancellationQueue),
                async (channel, message) => await ProcessTicketCancellationAsync(message));

            _logger.LogInformation("Subscribed to all ticket queues");

            await Task.Delay(Timeout.Infinite, stoppingToken);
        }

        private async Task ProcessTicketPurchaseAsync(RedisValue message)
        {
            if (!message.HasValue)
                return;

            try
            {
                var requestMessage = JsonSerializer.Deserialize<TicketPurchaseRequestMessage>(message!);
                if (requestMessage == null)
                {
                    _logger.LogWarning("Failed to deserialize ticket purchase request message");
                    return;
                }

                _logger.LogInformation("Processing ticket purchase for {Email}", requestMessage.Email);

                using var scope = _serviceScopeFactory.CreateScope();
                var ticketPurchaseService = scope.ServiceProvider.GetRequiredService<ITicketPurchaseService>();
                var ticketService = scope.ServiceProvider.GetRequiredService<ITicketService>();

                var purchaseRequest = requestMessage.ToTicketPurchaseRequest();
                var ticket = await ticketPurchaseService.PurchaseAsync(purchaseRequest);
                var detailedTicket = await ticketService.GetByIdAsync(ticket.TicketId);

                var ticketEvent = new TicketEvent
                {
                    EventType = "TicketPurchased",
                    EventDate = DateTime.UtcNow,
                    Data = JsonSerializer.Serialize(new TicketPurchasedEventData
                    {
                        TicketId = ticket.TicketId,
                        TicketCode = ticket.TicketCode,
                        Email = ticket.Email,
                        Country = ticket.Country,
                        TotalPrice = ticket.TotalPrice,
                        PurchasedAt = detailedTicket?.PurchaseDate ?? ticket.PurchaseDate,
                        RaceDays = MapRaceDays(detailedTicket)
                    })
                };

                await _subscriber.PublishAsync(
                    RedisChannel.Literal(RedisQueueNames.TicketEventsChannel),
                    JsonSerializer.Serialize(ticketEvent));

                _logger.LogInformation("Successfully processed ticket purchase. Ticket Code: {TicketCode}", ticket.TicketCode);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error processing ticket purchase message: {Message}", message);
            }
        }

        private async Task ProcessTicketModificationAsync(RedisValue message)
        {
            if (!message.HasValue)
                return;

            try
            {
                var requestMessage = JsonSerializer.Deserialize<TicketModificationRequestMessage>(message!);
                if (requestMessage == null)
                {
                    _logger.LogWarning("Failed to deserialize ticket modification request message");
                    return;
                }

                _logger.LogInformation("Processing ticket modification for {TicketCode}: {ModificationType}",
                    requestMessage.TicketCode, requestMessage.ModificationType);

                using var scope = _serviceScopeFactory.CreateScope();
                var ticketModificationService = scope.ServiceProvider.GetRequiredService<ITicketModificationService>();
                var ticketService = scope.ServiceProvider.GetRequiredService<ITicketService>();

                Ticket ticket;
                string raceDayName = string.Empty;
                string raceDayDate = string.Empty;
                Ticket? ticketBeforeChange = null;

                if (requestMessage.ModificationType == "AddDay")
                {
                    if (!requestMessage.ZoneId.HasValue)
                    {
                        _logger.LogWarning("ZoneId is required for AddDay modification");
                        return;
                    }

                    ticket = await ticketModificationService.AddRaceDayAsync(
                        requestMessage.TicketCode,
                        requestMessage.Email,
                        requestMessage.RaceDayId,
                        requestMessage.ZoneId.Value);

                    var detailedTicket = await ticketService.GetByIdAsync(ticket.TicketId);
                    var raceDayInfo = detailedTicket?.TicketRaceDays
                        .FirstOrDefault(trd => trd.RaceDayId == requestMessage.RaceDayId)?.RaceDay;

                    if (raceDayInfo != null)
                    {
                        raceDayName = raceDayInfo.Name;
                        raceDayDate = raceDayInfo.Date.ToString("yyyy-MM-dd");
                    }
                }
                else if (requestMessage.ModificationType == "RemoveDay")
                {
                    ticketBeforeChange = await ticketService.GetByCodeAndEmailAsync(
                        requestMessage.TicketCode,
                        requestMessage.Email);

                    ticket = await ticketModificationService.RemoveRaceDayAsync(
                        requestMessage.TicketCode,
                        requestMessage.Email,
                        requestMessage.RaceDayId);

                    var removedDayInfo = ticketBeforeChange?.TicketRaceDays
                        .FirstOrDefault(trd => trd.RaceDayId == requestMessage.RaceDayId)?.RaceDay;

                    if (removedDayInfo != null)
                    {
                        raceDayName = removedDayInfo.Name;
                        raceDayDate = removedDayInfo.Date.ToString("yyyy-MM-dd");
                    }
                }
                else
                {
                    _logger.LogWarning("Unknown modification type: {ModificationType}", requestMessage.ModificationType);
                    return;
                }

                var ticketEvent = new TicketEvent
                {
                    EventType = "TicketModified",
                    EventDate = DateTime.UtcNow,
                    Data = JsonSerializer.Serialize(new TicketModifiedEventData
                    {
                        TicketId = ticket.TicketId,
                        TicketCode = ticket.TicketCode,
                        ModificationType = requestMessage.ModificationType,
                        RaceDayId = requestMessage.RaceDayId,
                        RaceDayName = raceDayName,
                        RaceDayDate = raceDayDate,
                        ModifiedAt = ticket.UpdatedAt
                    })
                };

                await _subscriber.PublishAsync(
                    RedisChannel.Literal(RedisQueueNames.TicketEventsChannel),
                    JsonSerializer.Serialize(ticketEvent));

                _logger.LogInformation("Successfully processed ticket modification. Ticket Code: {TicketCode}", ticket.TicketCode);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error processing ticket modification message: {Message}", message);
            }
        }

        private async Task ProcessTicketCancellationAsync(RedisValue message)
        {
            if (!message.HasValue)
                return;

            try
            {
                var requestMessage = JsonSerializer.Deserialize<TicketCancellationRequestMessage>(message!);
                if (requestMessage == null)
                {
                    _logger.LogWarning("Failed to deserialize ticket cancellation request message");
                    return;
                }

                _logger.LogInformation("Processing ticket cancellation for {TicketCode}", requestMessage.TicketCode);

                using var scope = _serviceScopeFactory.CreateScope();
                var ticketService = scope.ServiceProvider.GetRequiredService<ITicketService>();

                var ticket = await ticketService.GetByCodeAndEmailAsync(requestMessage.TicketCode, requestMessage.Email);
                if (ticket == null)
                {
                    _logger.LogWarning("Ticket not found: {TicketCode}", requestMessage.TicketCode);
                    return;
                }

                var raceDays = MapRaceDays(ticket);

                await ticketService.CancelAsync(requestMessage.TicketCode, requestMessage.Email);

                var ticketEvent = new TicketEvent
                {
                    EventType = "TicketCancelled",
                    EventDate = DateTime.UtcNow,
                    Data = JsonSerializer.Serialize(new TicketCancelledEventData
                    {
                        TicketId = ticket.TicketId,
                        TicketCode = ticket.TicketCode,
                        CancelledAt = DateTime.UtcNow,
                        RaceDays = raceDays
                    })
                };

                await _subscriber.PublishAsync(
                    RedisChannel.Literal(RedisQueueNames.TicketEventsChannel),
                    JsonSerializer.Serialize(ticketEvent));

                _logger.LogInformation("Successfully processed ticket cancellation. Ticket Code: {TicketCode}", ticket.TicketCode);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error processing ticket cancellation message: {Message}", message);
            }
        }

        public override async Task StopAsync(CancellationToken stoppingToken)
        {
            _logger.LogInformation("Ticket Processing Background Worker stopping");
            await base.StopAsync(stoppingToken);
        }

        private static List<TicketRaceDayInfo> MapRaceDays(Ticket? ticket)
        {
            if (ticket == null)
            {
                return new List<TicketRaceDayInfo>();
            }

            return ticket.TicketRaceDays
                .Select(trd => new TicketRaceDayInfo
                {
                    RaceDayId = trd.RaceDayId,
                    RaceDayName = trd.RaceDay?.Name ?? string.Empty,
                    RaceDayDate = trd.RaceDay?.Date.ToString("yyyy-MM-dd") ?? string.Empty
                })
                .ToList();
        }
    }
}
