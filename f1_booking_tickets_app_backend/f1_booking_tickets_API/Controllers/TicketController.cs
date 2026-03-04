using f1_booking_tickets.Services.If;
using f1_booking_tickets_API.DTOs.Ticket;
using Microsoft.AspNetCore.Mvc;

namespace f1_booking_tickets_API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TicketController : ControllerBase
    {
        private readonly ITicketService _ticketService;
        private readonly ITicketModificationService _ticketModificationService;
        private readonly ITicketPurchaseService _ticketPurchaseService;

        public TicketController(
            ITicketService ticketService,
            ITicketModificationService ticketModificationService,
            ITicketPurchaseService ticketPurchaseService)
        {
            _ticketService = ticketService;
            _ticketModificationService = ticketModificationService;
            _ticketPurchaseService = ticketPurchaseService;
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
    }
}
