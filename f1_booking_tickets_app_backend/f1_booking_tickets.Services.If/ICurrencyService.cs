using f1_booking_tickets.Domain.Entities;

namespace f1_booking_tickets.Services.If
{
    public interface ICurrencyService
    {
        Task<IReadOnlyCollection<Currency>> GetSupportedAsync(CancellationToken cancellationToken = default);
        Task<Currency?> GetByCodeAsync(string code, CancellationToken cancellationToken = default);
        Task<decimal> GetExchangeRateAsync(string fromCurrencyCode, string toCurrencyCode, CancellationToken cancellationToken = default);
    }
}
