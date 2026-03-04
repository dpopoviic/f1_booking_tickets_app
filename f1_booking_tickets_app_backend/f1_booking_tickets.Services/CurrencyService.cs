using f1_booking_tickets.DataAccess;
using f1_booking_tickets.Domain.Entities;
using f1_booking_tickets.Services.If;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using System.Text.Json;

namespace f1_booking_tickets.Services
{
    public class CurrencyService : ICurrencyService
    {
        private readonly Context _context;
        private readonly HttpClient _httpClient;
        private readonly string _kursApiBaseUrl;

        public CurrencyService(Context context, IHttpClientFactory httpClientFactory, IConfiguration configuration)
        {
            _context = context;
            _httpClient = httpClientFactory.CreateClient();
            _kursApiBaseUrl = configuration["KursAPI:BaseUrl"] ?? "https://kurs.resenje.org/api/v1/currencies/";
        }

        public async Task<IReadOnlyCollection<Currency>> GetSupportedAsync(CancellationToken cancellationToken = default)
        {
            return await _context.Currencies
                .AsNoTracking()
                .ToListAsync(cancellationToken);
        }

        public async Task<Currency?> GetByCodeAsync(string code, CancellationToken cancellationToken = default)
        {
            return await _context.Currencies
                .AsNoTracking()
                .FirstOrDefaultAsync(c => c.Code == code, cancellationToken);
        }

        public async Task<decimal> GetExchangeRateAsync(string fromCurrencyCode, string toCurrencyCode, CancellationToken cancellationToken = default)
        {
            if (fromCurrencyCode == toCurrencyCode)
                return 1m;

            try
            {
                var url = $"{_kursApiBaseUrl}{fromCurrencyCode}/kurs/{toCurrencyCode}";
                var response = await _httpClient.GetAsync(url, cancellationToken);
                response.EnsureSuccessStatusCode();

                var json = await response.Content.ReadAsStringAsync(cancellationToken);
                var result = JsonSerializer.Deserialize<KursApiResponse>(json);

                return result?.ExchangeMiddleRate ?? 1m;
            }
            catch
            {
                return 1m;
            }
        }

        private class KursApiResponse
        {
            public decimal ExchangeMiddleRate { get; set; }
        }
    }
}
