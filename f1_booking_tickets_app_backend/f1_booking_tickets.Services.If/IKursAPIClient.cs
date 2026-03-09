using f1_booking_tickets.Services.If.Models;

namespace f1_booking_tickets.Services.If
{
    public interface IKursAPIClient
    {
        Task<KursResponse?> GetKursAsync(string code, CancellationToken cancellationToken = default);
        Task<KursRateResponse?> GetKursRateAsync(string fromCode, string toCode, CancellationToken cancellationToken = default);
    }
}
