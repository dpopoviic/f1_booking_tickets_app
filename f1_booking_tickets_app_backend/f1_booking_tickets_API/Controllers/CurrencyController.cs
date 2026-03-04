using f1_booking_tickets.Services.If;
using f1_booking_tickets_API.DTOs.Currency;
using Microsoft.AspNetCore.Mvc;

namespace f1_booking_tickets_API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CurrencyController : ControllerBase
    {
        private readonly ICurrencyService _currencyService;

        public CurrencyController(ICurrencyService currencyService)
        {
            _currencyService = currencyService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<GetCurrencyDTO>>> GetAll()
        {
            var currencies = await _currencyService.GetSupportedAsync();
            return Ok(currencies.Select(c => c.ToGetCurrencyDTO()));
        }

        [HttpGet("exchange-rate")]
        public async Task<ActionResult<decimal>> GetExchangeRate(
            [FromQuery] string from, 
            [FromQuery] string to)
        {
            var rate = await _currencyService.GetExchangeRateAsync(from, to);
            return Ok(new { from, to, rate });
        }
    }
}
