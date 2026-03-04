using f1_booking_tickets.Domain.Entities;

namespace f1_booking_tickets.Services.If
{
    public interface ITicketService
    {
        Task<Ticket?> GetByIdAsync(int ticketId, CancellationToken cancellationToken = default);
        Task<Ticket?> GetByCodeAndEmailAsync(string ticketCode, string email, CancellationToken cancellationToken = default);
        Task<IReadOnlyCollection<Ticket>> GetByCustomerIdAsync(int customerId, CancellationToken cancellationToken = default);
        Task CancelAsync(string ticketCode, string email, CancellationToken cancellationToken = default);
    }
}
