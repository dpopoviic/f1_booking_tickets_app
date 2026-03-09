using f1_booking_tickets.Domain.Entities;

namespace f1_booking_tickets.Services.If
{
    public interface ITicketModificationService
    {
        Task<Ticket> AddRaceDayAsync(string ticketCode, string email, int raceDayId, int zoneId, CancellationToken cancellationToken = default);
        Task<Ticket> RemoveRaceDayAsync(string ticketCode, string email, int raceDayId, CancellationToken cancellationToken = default);
    }
}
