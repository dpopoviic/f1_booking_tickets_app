using f1_booking_tickets.Domain.Entities;
using f1_booking_tickets.Services.If.Models;

namespace f1_booking_tickets.Services.If
{
    public interface ITicketPurchaseService
    {
        Task<Ticket> PurchaseAsync(TicketPurchaseRequest request, CancellationToken cancellationToken = default);
    }
}
