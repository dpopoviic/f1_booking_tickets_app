using f1_booking_tickets.Services.If;
using f1_booking_tickets_API.DTOs.SeatingZone;
using Microsoft.AspNetCore.Mvc;

namespace f1_booking_tickets_API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SeatingZoneController : ControllerBase
    {
        public static string ZonesByRaceCacheKey(int raceId) => $"zones:race:{raceId}";

        private readonly ISeatingZoneService _seatingZoneService;
        private readonly ICacheService _cacheService;

        public SeatingZoneController(ISeatingZoneService seatingZoneService, ICacheService cacheService)
        {
            _seatingZoneService = seatingZoneService;
            _cacheService = cacheService;
        }

        [HttpGet("race/{raceId}")]
        public async Task<ActionResult<IEnumerable<GetSeatingZoneDTO>>> GetByRaceId(int raceId)
        {
            var cached = await _cacheService.GetRecord<List<GetSeatingZoneDTO>>(ZonesByRaceCacheKey(raceId));
            if (cached != null)
                return Ok(cached);

            var zones = await _seatingZoneService.GetByRaceIdAsync(raceId);
            var result = zones.Select(z => z.ToGetSeatingZoneDTO()).ToList();

            await _cacheService.SetRecord(ZonesByRaceCacheKey(raceId), result);

            return Ok(result);
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

            await InvalidateRaceCache(created.RaceId);

            return CreatedAtAction(nameof(GetById), new { id = created.ZoneId }, created.ToGetSeatingZoneDTO());
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<GetSeatingZoneDTO>> Update(int id, [FromBody] UpdateSeatingZoneDTO dto)
        {
            if (id != dto.ZoneId)
                return BadRequest("Zone ID mismatch");

            var existing = await _seatingZoneService.GetByIdAsync(id);
            if (existing == null)
                return NotFound();

            var zone = dto.ToSeatingZone();
            zone.RaceId = existing.RaceId;
            var updated = await _seatingZoneService.UpdateAsync(zone);

            await InvalidateRaceCache(existing.RaceId);

            return Ok(updated.ToGetSeatingZoneDTO());
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var zone = await _seatingZoneService.GetByIdAsync(id);
            if (zone == null)
                return NotFound();

            await _seatingZoneService.DeleteAsync(id);

            await InvalidateRaceCache(zone.RaceId);

            return NoContent();
        }

        private async Task InvalidateRaceCache(int raceId)
        {
            await _cacheService.DeleteRecord(ZonesByRaceCacheKey(raceId));
            await _cacheService.DeleteRecord(RaceController.RaceDetailsCacheKey(raceId));
        }
    }
}
