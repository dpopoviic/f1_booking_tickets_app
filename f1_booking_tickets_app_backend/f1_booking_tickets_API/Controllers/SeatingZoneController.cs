using f1_booking_tickets.Services.If;
using f1_booking_tickets_API.DTOs.SeatingZone;
using Microsoft.AspNetCore.Mvc;

namespace f1_booking_tickets_API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SeatingZoneController : ControllerBase
    {
        private readonly ISeatingZoneService _seatingZoneService;

        public SeatingZoneController(ISeatingZoneService seatingZoneService)
        {
            _seatingZoneService = seatingZoneService;
        }

        [HttpGet("race/{raceId}")]
        public async Task<ActionResult<IEnumerable<GetSeatingZoneDTO>>> GetByRaceId(int raceId)
        {
            var zones = await _seatingZoneService.GetByRaceIdAsync(raceId);
            return Ok(zones.Select(z => z.ToGetSeatingZoneDTO()));
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<GetSeatingZoneDTO>> GetById(int id)
        {
            var zone = await _seatingZoneService.GetByIdAsync(id);

            if (zone == null)
                return NotFound();

            return Ok(zone.ToGetSeatingZoneDTO());
        }

        [HttpPost]
        public async Task<ActionResult<GetSeatingZoneDTO>> Create([FromBody] CreateSeatingZoneDTO dto)
        {
            var zone = dto.ToSeatingZone();
            var created = await _seatingZoneService.CreateAsync(zone);

            return CreatedAtAction(nameof(GetById), new { id = created.ZoneId }, created.ToGetSeatingZoneDTO());
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<GetSeatingZoneDTO>> Update(int id, [FromBody] UpdateSeatingZoneDTO dto)
        {
            if (id != dto.ZoneId)
                return BadRequest("Zone ID mismatch");

            var zone = dto.ToSeatingZone();
            var updated = await _seatingZoneService.UpdateAsync(zone);

            return Ok(updated.ToGetSeatingZoneDTO());
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            await _seatingZoneService.DeleteAsync(id);
            return NoContent();
        }
    }
}
