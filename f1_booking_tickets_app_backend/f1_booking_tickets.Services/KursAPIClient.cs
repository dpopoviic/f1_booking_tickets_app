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

        public async Task<KursRateResponse?> GetKursRateAsync(string fromCode, string toCode, CancellationToken cancellationToken = default)
        {
            try
            {
                var response = await _httpClient.GetAsync($"{_settings.BaseUrl}{fromCode}/kurs/{toCode}", cancellationToken);
                response.EnsureSuccessStatusCode();
                return await response.Content.ReadFromJsonAsync<KursRateResponse>(cancellationToken);
            }
            catch
            {
                return null;
            }
        }
    }
}
