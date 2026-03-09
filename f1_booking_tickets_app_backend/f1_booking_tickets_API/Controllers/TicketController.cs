using f1_booking_tickets.Services.If;
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

                return Ok(ticket.ToPurchaseTicketResponseDTO());
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

                return Ok(ticket.ToGetTicketDetailsDTO());
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
                var ticket = await _ticketModificationService.RemoveRaceDayAsync(
                    dto.TicketCode, 
                    dto.Email, 
                    dto.RaceDayId);

                return Ok(ticket.ToGetTicketDetailsDTO());
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
                await _ticketService.CancelAsync(dto.TicketCode, dto.Email);
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
    }
}
