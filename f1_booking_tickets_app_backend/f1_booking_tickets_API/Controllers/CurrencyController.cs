using f1_booking_tickets.Services.If;
using f1_booking_tickets_API.DTOs.Currency;
using Microsoft.AspNetCore.Mvc;

namespace f1_booking_tickets_API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CurrencyController : ControllerBase
    {
        public const string AllCurrenciesCacheKey = "currencies:all";
        public static string ExchangeRateCacheKey(string from, string to) => $"currencies:rate:{from}:{to}";

        private readonly ICurrencyService _currencyService;
        private readonly ICacheService _cacheService;

        public CurrencyController(ICurrencyService currencyService, ICacheService cacheService)
        {
            _currencyService = currencyService;
            _cacheService = cacheService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<GetCurrencyDTO>>> GetAll()
        {
            var cached = await _cacheService.GetRecord<List<GetCurrencyDTO>>(AllCurrenciesCacheKey);
            if (cached != null)
                return Ok(cached);

            var currencies = await _currencyService.GetSupportedAsync();
            var result = currencies.Select(c => c.ToGetCurrencyDTO()).ToList();

            await _cacheService.SetRecord(AllCurrenciesCacheKey, result);

            return Ok(result);
        }

        [HttpGet("exchange-rate")]
        public async Task<ActionResult<decimal>> GetExchangeRate(
            [FromQuery] string from, 
            [FromQuery] string to)
        {
            var cacheKey = ExchangeRateCacheKey(from, to);
            var cached = await _cacheService.GetRecord<object>(cacheKey);
            if (cached != null)
                return Ok(cached);

            var rate = await _currencyService.GetExchangeRateAsync(from, to);
            var result = new { from, to, rate };

            await _cacheService.SetRecord(cacheKey, result);

            return Ok(result);
        }
    }
}
