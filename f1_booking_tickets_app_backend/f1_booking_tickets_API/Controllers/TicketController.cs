using f1_booking_tickets.Services.If;
using f1_booking_tickets.Domain.Entities;
using f1_booking_tickets.Domain.Events;
using f1_booking_tickets_API.Configuration;
using f1_booking_tickets_API.DTOs.Ticket;
using f1_booking_tickets_API.Messages;
using Microsoft.AspNetCore.Mvc;
using StackExchange.Redis;
using System.Text.Json;

namespace f1_booking_tickets_API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TicketController : ControllerBase
    {
        private readonly ITicketService _ticketService;
        private readonly ITicketModificationService _ticketModificationService;
        private readonly ITicketPurchaseService _ticketPurchaseService;
        private readonly IConnectionMultiplexer _connectionMultiplexer;
        private readonly ILogger<TicketController> _logger;

        public TicketController(
            ITicketService ticketService,
            ITicketModificationService ticketModificationService,
            ITicketPurchaseService ticketPurchaseService,
            IConnectionMultiplexer connectionMultiplexer,
            ILogger<TicketController> logger)
        {
            _ticketService = ticketService;
            _ticketModificationService = ticketModificationService;
            _ticketPurchaseService = ticketPurchaseService;
            _connectionMultiplexer = connectionMultiplexer;
            _logger = logger;
        }

        [HttpPost("purchase")]
        public async Task<ActionResult<PurchaseTicketResponseDTO>> Purchase([FromBody] PurchaseTicketDTO dto)
        {
            try
            {
                var request = dto.ToTicketPurchaseRequest();
                var ticket = await _ticketPurchaseService.PurchaseAsync(request);
                var ticketWithDetails = await _ticketService.GetByIdAsync(ticket.TicketId);
                await PublishTicketPurchasedEventAsync(ticket.TicketId);

                return Ok((ticketWithDetails ?? ticket).ToPurchaseTicketResponseDTO());
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost("purchase-async")]
        public async Task<IActionResult> PurchaseAsync([FromBody] PurchaseTicketDTO dto)
        {
            try
            {
                var message = new TicketPurchaseRequestMessage
                {
                    FirstName = dto.FirstName,
                    LastName = dto.LastName,
                    Address = dto.Address,
                    Country = dto.Country,
                    PhoneNumber = dto.PhoneNumber,
                    Email = dto.Email,
                    EmailConfirmation = dto.EmailConfirmation,
                    CurrencyCode = dto.CurrencyCode,
                    PromoCode = dto.PromoCode,
                    Items = dto.Items.Select(i => new TicketPurchaseItemMessage
                    {
                        RaceDayId = i.RaceDayId,
                        ZoneId = i.ZoneId
                    }).ToList()
                };

                var subscriber = _connectionMultiplexer.GetSubscriber();
                await subscriber.PublishAsync(
                    RedisChannel.Literal(RedisQueueNames.TicketPurchaseQueue),
                    JsonSerializer.Serialize(message));

                _logger.LogInformation("Ticket purchase request queued for {Email}", dto.Email);

                return Accepted(new { message = "Ticket purchase request has been queued for processing" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error queueing ticket purchase request");
                return StatusCode(500, "Failed to queue ticket purchase request");
            }
        }

        [HttpGet]
        public async Task<ActionResult<GetTicketDetailsDTO>> GetByCodeAndEmail([FromQuery] string ticketCode, [FromQuery] string email)
        {
            var ticket = await _ticketService.GetByCodeAndEmailAsync(ticketCode, email);

            if (ticket == null)
                return NotFound();

            return Ok(ticket.ToGetTicketDetailsDTO());
        }

        [HttpPost("add-day")]
        public async Task<ActionResult<GetTicketDetailsDTO>> AddRaceDay([FromBody] ModifyTicketDTO dto)
        {
            try
            {
                var ticket = await _ticketModificationService.AddRaceDayAsync(
                    dto.TicketCode, 
                    dto.Email, 
                    dto.RaceDayId, 
                    dto.ZoneId);

                var ticketWithDetails = await _ticketService.GetByIdAsync(ticket.TicketId);
                var raceDayInfo = ticketWithDetails?.TicketRaceDays
                    .FirstOrDefault(trd => trd.RaceDayId == dto.RaceDayId)?.RaceDay;

                await PublishTicketModifiedEventAsync(
                    ticket.TicketId,
                    ticket.TicketCode,
                    "AddDay",
                    dto.RaceDayId,
                    ticket.UpdatedAt,
                    raceDayInfo?.Name,
                    raceDayInfo?.Date.ToString("yyyy-MM-dd"));

                return Ok((ticketWithDetails ?? ticket).ToGetTicketDetailsDTO());
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost("add-day-async")]
        public async Task<IActionResult> AddRaceDayAsync([FromBody] ModifyTicketDTO dto)
        {
            try
            {
                var message = new TicketModificationRequestMessage
                {
                    TicketCode = dto.TicketCode,
                    Email = dto.Email,
                    RaceDayId = dto.RaceDayId,
                    ZoneId = dto.ZoneId,
                    ModificationType = "AddDay"
                };

                var subscriber = _connectionMultiplexer.GetSubscriber();
                await subscriber.PublishAsync(
                    RedisChannel.Literal(RedisQueueNames.TicketModificationQueue),
                    JsonSerializer.Serialize(message));

                _logger.LogInformation("Add race day request queued for ticket {TicketCode}", dto.TicketCode);

                return Accepted(new { message = "Add race day request has been queued for processing" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error queueing add race day request");
                return StatusCode(500, "Failed to queue add race day request");
            }
        }

        [HttpPost("remove-day")]
        public async Task<ActionResult<GetTicketDetailsDTO>> RemoveRaceDay([FromBody] ModifyTicketDTO dto)
        {
            try
            {
                var ticketBeforeChange = await _ticketService.GetByCodeAndEmailAsync(dto.TicketCode, dto.Email);
                var removedDayInfo = ticketBeforeChange?.TicketRaceDays
                    .FirstOrDefault(trd => trd.RaceDayId == dto.RaceDayId)?.RaceDay;

                var ticket = await _ticketModificationService.RemoveRaceDayAsync(
                    dto.TicketCode, 
                    dto.Email, 
                    dto.RaceDayId);

                var ticketWithDetails = await _ticketService.GetByIdAsync(ticket.TicketId);

                await PublishTicketModifiedEventAsync(
                    ticket.TicketId,
                    ticket.TicketCode,
                    "RemoveDay",
                    dto.RaceDayId,
                    ticket.UpdatedAt,
                    removedDayInfo?.Name,
                    removedDayInfo?.Date.ToString("yyyy-MM-dd"));

                return Ok((ticketWithDetails ?? ticket).ToGetTicketDetailsDTO());
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost("remove-day-async")]
        public async Task<IActionResult> RemoveRaceDayAsync([FromBody] ModifyTicketDTO dto)
        {
            try
            {
                var message = new TicketModificationRequestMessage
                {
                    TicketCode = dto.TicketCode,
                    Email = dto.Email,
                    RaceDayId = dto.RaceDayId,
                    ModificationType = "RemoveDay"
                };

                var subscriber = _connectionMultiplexer.GetSubscriber();
                await subscriber.PublishAsync(
                    RedisChannel.Literal(RedisQueueNames.TicketModificationQueue),
                    JsonSerializer.Serialize(message));

                _logger.LogInformation("Remove race day request queued for ticket {TicketCode}", dto.TicketCode);

                return Accepted(new { message = "Remove race day request has been queued for processing" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error queueing remove race day request");
                return StatusCode(500, "Failed to queue remove race day request");
            }
        }

        [HttpPost("cancel")]
        public async Task<IActionResult> Cancel([FromBody] CancelTicketDTO dto)
        {
            try
            {
                var existingTicket = await _ticketService.GetByCodeAndEmailAsync(dto.TicketCode, dto.Email);
                await _ticketService.CancelAsync(dto.TicketCode, dto.Email);

                if (existingTicket != null)
                {
                    await PublishTicketCancelledEventAsync(existingTicket);
                }

                return NoContent();
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost("cancel-async")]
        public async Task<IActionResult> CancelAsync([FromBody] CancelTicketDTO dto)
        {
            try
            {
                var message = new TicketCancellationRequestMessage
                {
                    TicketCode = dto.TicketCode,
                    Email = dto.Email
                };

                var subscriber = _connectionMultiplexer.GetSubscriber();
                await subscriber.PublishAsync(
                    RedisChannel.Literal(RedisQueueNames.TicketCancellationQueue),
                    JsonSerializer.Serialize(message));

                _logger.LogInformation("Cancel ticket request queued for ticket {TicketCode}", dto.TicketCode);

                return Accepted(new { message = "Cancel ticket request has been queued for processing" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error queueing cancel ticket request");
                return StatusCode(500, "Failed to queue cancel ticket request");
            }
        }

        private async Task PublishTicketPurchasedEventAsync(int ticketId)
        {
            var ticket = await _ticketService.GetByIdAsync(ticketId);
            if (ticket == null)
            {
                return;
            }

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
                    PurchasedAt = ticket.PurchaseDate,
                    RaceDays = MapRaceDays(ticket)
                })
            };

            await PublishTicketEventAsync(ticketEvent);
        }

        private async Task PublishTicketModifiedEventAsync(
            int ticketId,
            string ticketCode,
            string modificationType,
            int raceDayId,
            DateTime modifiedAt,
            string? raceDayName,
            string? raceDayDate)
        {
            var ticketEvent = new TicketEvent
            {
                EventType = "TicketModified",
                EventDate = DateTime.UtcNow,
                Data = JsonSerializer.Serialize(new TicketModifiedEventData
                {
                    TicketId = ticketId,
                    TicketCode = ticketCode,
                    ModificationType = modificationType,
                    RaceDayId = raceDayId,
                    RaceDayName = raceDayName ?? string.Empty,
                    RaceDayDate = raceDayDate ?? string.Empty,
                    ModifiedAt = modifiedAt
                })
            };

            await PublishTicketEventAsync(ticketEvent);
        }

        private async Task PublishTicketCancelledEventAsync(Ticket ticket)
        {
            var ticketEvent = new TicketEvent
            {
                EventType = "TicketCancelled",
                EventDate = DateTime.UtcNow,
                Data = JsonSerializer.Serialize(new TicketCancelledEventData
                {
                    TicketId = ticket.TicketId,
                    TicketCode = ticket.TicketCode,
                    CancelledAt = DateTime.UtcNow,
                    RaceDays = MapRaceDays(ticket)
                })
            };

            await PublishTicketEventAsync(ticketEvent);
        }

        private async Task PublishTicketEventAsync(TicketEvent ticketEvent)
        {
            try
            {
                var subscriber = _connectionMultiplexer.GetSubscriber();
                await subscriber.PublishAsync(
                    RedisChannel.Literal(RedisQueueNames.TicketEventsChannel),
                    JsonSerializer.Serialize(ticketEvent));
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, "Ticket operation succeeded but event publish failed: {EventType}", ticketEvent.EventType);
            }
        }

        private static List<TicketRaceDayInfo> MapRaceDays(Ticket ticket)
        {
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
