using f1_booking_tickets.Services.If;
using f1_booking_tickets_API.DTOs.RaceDay;
using Microsoft.AspNetCore.Mvc;

namespace f1_booking_tickets_API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RaceDayController : ControllerBase
    {
        public static string RaceDaysByRaceCacheKey(int raceId) => $"racedays:race:{raceId}";

        private readonly IRaceDayService _raceDayService;
        private readonly ICacheService _cacheService;

        public RaceDayController(IRaceDayService raceDayService, ICacheService cacheService)
        {
            _raceDayService = raceDayService;
            _cacheService = cacheService;
        }

        [HttpGet("race/{raceId}")]
        public async Task<ActionResult<IEnumerable<GetRaceDayDTO>>> GetByRaceId(int raceId)
        {
            var cached = await _cacheService.GetRecord<List<GetRaceDayDTO>>(RaceDaysByRaceCacheKey(raceId));
            if (cached != null)
                return Ok(cached);

            var raceDays = await _raceDayService.GetByRaceIdAsync(raceId);
            var result = raceDays.Select(rd => rd.ToGetRaceDayDTO()).ToList();

            await _cacheService.SetRecord(RaceDaysByRaceCacheKey(raceId), result);

            return Ok(result);
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

            await InvalidateRaceCache(created.RaceId);

            return CreatedAtAction(nameof(GetById), new { id = created.RaceDayId }, created.ToGetRaceDayDTO());
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<GetRaceDayDTO>> Update(int id, [FromBody] UpdateRaceDayDTO dto)
        {
            if (id != dto.RaceDayId)
                return BadRequest("RaceDay ID mismatch");

            var existing = await _raceDayService.GetByIdAsync(id);
            if (existing == null)
                return NotFound();

            var raceDay = dto.ToRaceDay();
            raceDay.RaceId = existing.RaceId;
            var updated = await _raceDayService.UpdateAsync(raceDay);

            await InvalidateRaceCache(existing.RaceId);

            return Ok(updated.ToGetRaceDayDTO());
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var raceDay = await _raceDayService.GetByIdAsync(id);
            if (raceDay == null)
                return NotFound();

            await _raceDayService.DeleteAsync(id);

            await InvalidateRaceCache(raceDay.RaceId);

            return NoContent();
        }

        private async Task InvalidateRaceCache(int raceId)
        {
            await _cacheService.DeleteRecord(RaceDaysByRaceCacheKey(raceId));
            await _cacheService.DeleteRecord(RaceController.RaceDetailsCacheKey(raceId));
        }
    }
}
