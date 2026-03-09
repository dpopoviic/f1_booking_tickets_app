using f1_portal_api.DataAccess;
using f1_portal_api.Domain;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace f1_portal_api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ReportsController : ControllerBase
    {
        private readonly Context _context;

        public ReportsController(Context context)
        {
            _context = context;
        }

        [HttpGet("by-race-day")]
        public async Task<ActionResult<List<TicketsByRaceDay>>> GetTicketsByRaceDay()
        {
            var result = await _context.TicketsByRaceDay
                .OrderBy(x => x.RaceDayDate)
                .ToListAsync();

            return Ok(result);
        }

        [HttpGet("by-purchase-date")]
        public async Task<ActionResult<List<TicketsByPurchaseDate>>> GetTicketsByPurchaseDate()
        {
            var result = await _context.TicketsByPurchaseDate
                .OrderBy(x => x.PurchaseDate)
                .ToListAsync();

            return Ok(result);
        }
    }
}
