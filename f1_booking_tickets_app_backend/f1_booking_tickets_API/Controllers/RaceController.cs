using f1_booking_tickets.Services.If;
using f1_booking_tickets_API.DTOs.Race;
using Microsoft.AspNetCore.Mvc;

namespace f1_booking_tickets_API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RaceController : ControllerBase
    {
        public const string AllRacesCacheKey = "races:all";
        public static string RaceDetailsCacheKey(int id) => $"races:{id}:details";

        private readonly IRaceService _raceService;
        private readonly ICacheService _cacheService;

        public RaceController(IRaceService raceService, ICacheService cacheService)
        {
            _raceService = raceService;
            _cacheService = cacheService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<GetRaceDTO>>> GetAll()
        {
            var cached = await _cacheService.GetRecord<List<GetRaceDTO>>(AllRacesCacheKey);
            if (cached != null)
                return Ok(cached);

            var races = await _raceService.GetAllAsync();
            var result = races.Select(race => race.ToGetRaceDTO()).ToList();

            await _cacheService.SetRecord(AllRacesCacheKey, result);

            return Ok(result);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<GetRaceDetailsDTO>> GetById(int id)
        {
            var cached = await _cacheService.GetRecord<GetRaceDetailsDTO>(RaceDetailsCacheKey(id));
            if (cached != null)
                return Ok(cached);

            var race = await _raceService.GetByIdAsync(id);
            
            if (race == null)
                return NotFound();

            var result = race.ToGetRaceDetailsDTO();
            await _cacheService.SetRecord(RaceDetailsCacheKey(id), result);

            return Ok(result);
        }

        [HttpPost]
        public async Task<ActionResult<GetRaceDetailsDTO>> Create([FromBody] CreateRaceDTO dto)
        {
            var race = dto.ToRace();
            var created = await _raceService.CreateAsync(race);

            await _cacheService.DeleteRecord(AllRacesCacheKey);

            return CreatedAtAction(nameof(GetById), new { id = created.RaceId }, created.ToGetRaceDetailsDTO());
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<GetRaceDetailsDTO>> Update(int id, [FromBody] UpdateRaceDTO dto)
        {
            if (id != dto.RaceId)
                return BadRequest("Race ID mismatch");

            var race = dto.ToRace();
            var updated = await _raceService.UpdateAsync(race);

            await _cacheService.DeleteRecord(AllRacesCacheKey);
            await _cacheService.DeleteRecord(RaceDetailsCacheKey(id));

            return Ok(updated.ToGetRaceDetailsDTO());
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            await _raceService.DeleteAsync(id);

            await _cacheService.DeleteRecord(AllRacesCacheKey);
            await _cacheService.DeleteRecord(RaceDetailsCacheKey(id));

            return NoContent();
        }
    }
}
