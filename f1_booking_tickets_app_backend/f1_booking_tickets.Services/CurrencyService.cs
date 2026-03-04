using f1_booking_tickets.DataAccess;
using f1_booking_tickets.Domain.Entities;
using f1_booking_tickets.Services.If;
using Microsoft.EntityFrameworkCore;

namespace f1_booking_tickets.Services
{
    public class CurrencyService : ICurrencyService
    {
        private readonly Context _context;
        private readonly IKursAPIClient _kursAPIClient;

        public CurrencyService(Context context, IKursAPIClient kursAPIClient)
        {
            _context = context;
            _kursAPIClient = kursAPIClient;
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
                var rateResponse = await _kursAPIClient.GetKursRateAsync(fromCurrencyCode, toCurrencyCode, cancellationToken);
                
                if (rateResponse != null)
                    return rateResponse.ExchangeMiddleRate;

                return 1m;
            }
            catch
            {
                return 1m;
            }
        }
    }
}
