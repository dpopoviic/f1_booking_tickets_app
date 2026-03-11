using f1_booking_tickets.Services.If;
using f1_booking_tickets.Services.If.Models;
using Microsoft.Extensions.Options;
using System.Net.Http.Json;

namespace f1_booking_tickets.Services
{
    public class KursAPIClient : IKursAPIClient
    {
        private readonly HttpClient _httpClient;
        private readonly KursAPISettings _settings;

        public KursAPIClient(HttpClient httpClient, IOptions<KursAPISettings> settings)
        {
            _httpClient = httpClient;
            _settings = settings.Value;
        }

        public async Task<KursResponse?> GetKursAsync(string code, CancellationToken cancellationToken = default)
        {
            try
            {
                var response = await _httpClient.GetAsync($"{_settings.BaseUrl}{code}", cancellationToken);
                response.EnsureSuccessStatusCode();
                return await response.Content.ReadFromJsonAsync<KursResponse>(cancellationToken);
            }
            catch
            {
                return null;
            }
        }

        public async Task<KursDailyRateApiResponse?> GetDailyRateAsync(string code, CancellationToken cancellationToken = default)
        {
            try
            {
                var response = await _httpClient.GetAsync($"{_settings.BaseUrl}{code}/rates/today", cancellationToken);
                response.EnsureSuccessStatusCode();
                return await response.Content.ReadFromJsonAsync<KursDailyRateApiResponse>(cancellationToken);
            }
            catch
            {
                return null;
            }
        }

        public async Task<KursRateResponse?> GetKursRateAsync(string fromCode, string toCode, CancellationToken cancellationToken = default)
        {
            try
            {

                var fromRate = await GetDailyRateAsync(fromCode, cancellationToken);
                var toRate = await GetDailyRateAsync(toCode, cancellationToken);

                if (fromRate == null || toRate == null || toRate.ExchangeMiddle == 0)
                    return null;

                var crossRate = fromRate.ExchangeMiddle / toRate.ExchangeMiddle;

                return new KursRateResponse
                {
                    CurrencyCode = toCode,
                    ExchangeMiddleRate = crossRate,
                    ExchangeRate = crossRate,
                    Date = DateTime.UtcNow
                };
            }
            catch
            {
                return null;
            }
        }
    }
}
