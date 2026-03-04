using f1_booking_tickets.Services.If;
using f1_booking_tickets_API.DTOs.RaceDay;
using Microsoft.AspNetCore.Mvc;

namespace f1_booking_tickets_API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RaceDayController : ControllerBase
    {
        private readonly IRaceDayService _raceDayService;

        public RaceDayController(IRaceDayService raceDayService)
        {
            _raceDayService = raceDayService;
        }

        [HttpGet("race/{raceId}")]
        public async Task<ActionResult<IEnumerable<GetRaceDayDTO>>> GetByRaceId(int raceId)
        {
            var raceDays = await _raceDayService.GetByRaceIdAsync(raceId);
            return Ok(raceDays.Select(rd => rd.ToGetRaceDayDTO()));
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<GetRaceDayDTO>> GetById(int id)
        {
            var raceDay = await _raceDayService.GetByIdAsync(id);

            if (raceDay == null)
                return NotFound();

            return Ok(raceDay.ToGetRaceDayDTO());
        }

        [HttpPost]
        public async Task<ActionResult<GetRaceDayDTO>> Create([FromBody] CreateRaceDayDTO dto)
        {
            var raceDay = dto.ToRaceDay();
            var created = await _raceDayService.CreateAsync(raceDay);

            return CreatedAtAction(nameof(GetById), new { id = created.RaceDayId }, created.ToGetRaceDayDTO());
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<GetRaceDayDTO>> Update(int id, [FromBody] UpdateRaceDayDTO dto)
        {
            if (id != dto.RaceDayId)
                return BadRequest("RaceDay ID mismatch");

            var raceDay = dto.ToRaceDay();
            var updated = await _raceDayService.UpdateAsync(raceDay);

            return Ok(updated.ToGetRaceDayDTO());
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            await _raceDayService.DeleteAsync(id);
            return NoContent();
        }
    }
}
