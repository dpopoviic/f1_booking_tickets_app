using f1_booking_tickets.Domain.Entities;

namespace f1_booking_tickets.Services.If
{
    public interface IPromoCodeService
    {
        Task<PromoCode?> GetByCodeAsync(string code, CancellationToken cancellationToken = default);
        Task<PromoCode> GenerateForTicketAsync(int ticketId, CancellationToken cancellationToken = default);
        Task<bool> TryApplyAsync(string code, int ticketId, CancellationToken cancellationToken = default);
        Task MarkAsUsedAsync(int promoCodeId, CancellationToken cancellationToken = default);
        Task InvalidateByTicketAsync(int ticketId, CancellationToken cancellationToken = default);
    }
}
