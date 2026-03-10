using f1_portal_api.DataAccess;
using f1_portal_api.Domain;
using f1_portal_api.Domain.Events;
using Microsoft.EntityFrameworkCore;
using StackExchange.Redis;
using System.Text.Json;

namespace f1_portal_api.HostedServices
{
    public class BackgroundWorker : BackgroundService
    {
        private readonly IServiceScopeFactory _serviceScopeFactory;
        private readonly ILogger<BackgroundWorker> _logger;
        private readonly ISubscriber _subscriber;

        public BackgroundWorker(
            IConnectionMultiplexer connectionMultiplexer,
            IServiceScopeFactory serviceScopeFactory,
            ILogger<BackgroundWorker> logger)
        {
            _serviceScopeFactory = serviceScopeFactory;
            _logger = logger;
            _subscriber = connectionMultiplexer.GetSubscriber();
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            await _subscriber.SubscribeAsync(RedisChannel.Literal("ticket_events"), async (channel, message) =>
            {
                if (!message.HasValue) return;

                try
                {
                    var ticketEvent = JsonSerializer.Deserialize<TicketEvent>(message!, new JsonSerializerOptions
                    {
                        PropertyNameCaseInsensitive = true
                    });

                    if (ticketEvent == null) return;

                    using var scope = _serviceScopeFactory.CreateScope();
                    var context = scope.ServiceProvider.GetRequiredService<Context>();

                    var options = new JsonSerializerOptions { PropertyNameCaseInsensitive = true };

                    switch (ticketEvent.EventType)
                    {
                        case "TicketPurchased":
                            var purchasedData = JsonSerializer.Deserialize<TicketPurchasedEventData>(ticketEvent.Data, options);
                            if (purchasedData != null)
                            {
                                await HandleTicketPurchased(context, purchasedData);
                                _logger.LogInformation("Processed TicketPurchased event for TicketId: {TicketId}", purchasedData.TicketId);
                            }
                            break;

                        case "TicketModified":
                            var modifiedData = JsonSerializer.Deserialize<TicketModifiedEventData>(ticketEvent.Data, options);
                            if (modifiedData != null)
                            {
                                await HandleTicketModified(context, modifiedData);
                                _logger.LogInformation("Processed TicketModified event for TicketId: {TicketId}, Type: {Type}",
                                    modifiedData.TicketId, modifiedData.ModificationType);
                            }
                            break;

                        case "TicketCancelled":
                            var cancelledData = JsonSerializer.Deserialize<TicketCancelledEventData>(ticketEvent.Data, options);
                            if (cancelledData != null)
                            {
                                await HandleTicketCancelled(context, cancelledData);
                                _logger.LogInformation("Processed TicketCancelled event for TicketId: {TicketId}", cancelledData.TicketId);
                            }
                            break;

                        default:
                            _logger.LogWarning("Unknown event type: {EventType}", ticketEvent.EventType);
                            break;
                    }
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Error processing ticket event: {Message}", message);
                }
            });

            await Task.Delay(Timeout.Infinite, stoppingToken);
        }
        private async Task HandleTicketPurchased(Context context, TicketPurchasedEventData eventData)
        {
            var raceDays = eventData.RaceDays ?? new List<TicketRaceDayInfo>();

            if (raceDays.Count == 0)
            {
                _logger.LogWarning("TicketPurchased event for TicketId {TicketId} does not include race day data", eventData.TicketId);
            }

            foreach (var raceDay in raceDays)
            {
                var existing = await context.TicketsByRaceDay
                    .FirstOrDefaultAsync(x => x.RaceDayId == raceDay.RaceDayId);

                if (existing != null)
                {
                    existing.TicketCount += 1;
                    context.TicketsByRaceDay.Update(existing);
                }
                else
                {
                    context.TicketsByRaceDay.Add(new TicketsByRaceDay
                    {
                        RaceDayId = raceDay.RaceDayId,
                        RaceDayName = raceDay.RaceDayName,
                        RaceDayDate = raceDay.RaceDayDate,
                        TicketCount = 1
                    });
                }
            }

            var purchaseDate = eventData.PurchasedAt.Date.ToString("yyyy-MM-dd");
            var dateEntry = await context.TicketsByPurchaseDate
                .FirstOrDefaultAsync(x => x.PurchaseDate == purchaseDate);

            if (dateEntry != null)
            {
                dateEntry.TicketCount += 1;
                context.TicketsByPurchaseDate.Update(dateEntry);
            }
            else
            {
                context.TicketsByPurchaseDate.Add(new TicketsByPurchaseDate
                {
                    PurchaseDate = purchaseDate,
                    TicketCount = 1
                });
            }

            await context.SaveChangesAsync();
        }

        private async Task HandleTicketModified(Context context, TicketModifiedEventData eventData)
        {
            var existing = await context.TicketsByRaceDay
                .FirstOrDefaultAsync(x => x.RaceDayId == eventData.RaceDayId);

            if (eventData.ModificationType == "AddDay")
            {
                if (string.IsNullOrWhiteSpace(eventData.RaceDayName) || string.IsNullOrWhiteSpace(eventData.RaceDayDate))
                {
                    _logger.LogWarning(
                        "TicketModified AddDay for TicketId {TicketId} has missing race day metadata",
                        eventData.TicketId);
                }

                if (existing != null)
                {
                    existing.TicketCount += 1;
                    context.TicketsByRaceDay.Update(existing);
                }
                else
                {
                    context.TicketsByRaceDay.Add(new TicketsByRaceDay
                    {
                        RaceDayId = eventData.RaceDayId,
                        RaceDayName = eventData.RaceDayName,
                        RaceDayDate = eventData.RaceDayDate,
                        TicketCount = 1
                    });
                }
            }
            else if (eventData.ModificationType == "RemoveDay")
            {
                if (existing != null && existing.TicketCount > 0)
                {
                    existing.TicketCount -= 1;
                    context.TicketsByRaceDay.Update(existing);
                }
                else
                {
                    _logger.LogWarning(
                        "TicketModified RemoveDay for TicketId {TicketId} ignored because race day {RaceDayId} is missing in report DB",
                        eventData.TicketId,
                        eventData.RaceDayId);
                }
            }

            await context.SaveChangesAsync();
        }
        private async Task HandleTicketCancelled(Context context, TicketCancelledEventData eventData)
        {
            var raceDays = eventData.RaceDays ?? new List<TicketRaceDayInfo>();

            if (raceDays.Count == 0)
            {
                _logger.LogWarning("TicketCancelled event for TicketId {TicketId} does not include race day data", eventData.TicketId);
            }

            foreach (var raceDay in raceDays)
            {
                var existing = await context.TicketsByRaceDay
                    .FirstOrDefaultAsync(x => x.RaceDayId == raceDay.RaceDayId);

                if (existing != null && existing.TicketCount > 0)
                {
                    existing.TicketCount -= 1;
                    context.TicketsByRaceDay.Update(existing);
                }
            }

            await context.SaveChangesAsync();
        }
    }
}
