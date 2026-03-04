using f1_booking_tickets.Services.If;
using f1_booking_tickets_API.DTOs.Race;
using Microsoft.AspNetCore.Mvc;

namespace f1_booking_tickets_API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RaceController : ControllerBase
    {
        private readonly IRaceService _raceService;

        public RaceController(IRaceService raceService)
        {
            _raceService = raceService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<GetRaceDTO>>> GetAll()
        {
            var races = await _raceService.GetAllAsync();
            return Ok(races.Select(race => race.ToGetRaceDTO()));
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<GetRaceDetailsDTO>> GetById(int id)
        {
            var race = await _raceService.GetByIdAsync(id);
            
            if (race == null)
                return NotFound();

            return Ok(race.ToGetRaceDetailsDTO());
        }

        [HttpPost]
        public async Task<ActionResult<GetRaceDetailsDTO>> Create([FromBody] CreateRaceDTO dto)
        {
            var race = dto.ToRace();
            var created = await _raceService.CreateAsync(race);

            return CreatedAtAction(nameof(GetById), new { id = created.RaceId }, created.ToGetRaceDetailsDTO());
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<GetRaceDetailsDTO>> Update(int id, [FromBody] UpdateRaceDTO dto)
        {
            if (id != dto.RaceId)
                return BadRequest("Race ID mismatch");

            var race = dto.ToRace();
            var updated = await _raceService.UpdateAsync(race);

            return Ok(updated.ToGetRaceDetailsDTO());
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            await _raceService.DeleteAsync(id);
            return NoContent();
        }
    }
}
