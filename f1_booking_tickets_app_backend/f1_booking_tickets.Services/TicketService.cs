using f1_booking_tickets.DataAccess;
using f1_booking_tickets.Domain.Entities;
using f1_booking_tickets.Services.If;
using Microsoft.EntityFrameworkCore;

namespace f1_booking_tickets.Services
{
    public class TicketService : ITicketService
    {
        private readonly Context _context;

        public TicketService(Context context)
        {
            _context = context;
        }

        public async Task<Ticket?> GetByIdAsync(int ticketId, CancellationToken cancellationToken = default)
        {
            return await _context.Tickets
                .Include(t => t.Currency)
                .Include(t => t.TicketRaceDays)
                    .ThenInclude(trd => trd.RaceDay)
                .Include(t => t.TicketRaceDays)
                    .ThenInclude(trd => trd.SeatingZone)
                .Include(t => t.CreatedPromoCode)
                .Include(t => t.UsedPromoCode)
                .AsNoTracking()
                .FirstOrDefaultAsync(t => t.TicketId == ticketId, cancellationToken);
        }

        public async Task<Ticket?> GetByCodeAndEmailAsync(string ticketCode, string email, CancellationToken cancellationToken = default)
        {
            return await _context.Tickets
                .Include(t => t.Currency)
                .Include(t => t.TicketRaceDays)
                    .ThenInclude(trd => trd.RaceDay)
                .Include(t => t.TicketRaceDays)
                    .ThenInclude(trd => trd.SeatingZone)
                .Include(t => t.CreatedPromoCode)
                .Include(t => t.UsedPromoCode)
                .AsNoTracking()
                .FirstOrDefaultAsync(t => t.TicketCode == ticketCode && t.Email == email, cancellationToken);
        }

        public async Task CancelAsync(string ticketCode, string email, CancellationToken cancellationToken = default)
        {
            var ticket = await _context.Tickets
                .Include(t => t.CreatedPromoCode)
                .FirstOrDefaultAsync(t => t.TicketCode == ticketCode && t.Email == email, cancellationToken);

            if (ticket == null)
                throw new InvalidOperationException("Ticket not found");

            if (!ticket.IsActive)
                throw new InvalidOperationException("Ticket is already cancelled");

            ticket.IsActive = false;
            ticket.UpdatedAt = DateTime.UtcNow;

            if (ticket.CreatedPromoCode != null)
            {
                ticket.CreatedPromoCode.Status = PromoCodeStatus.Inactive;
            }

            await _context.SaveChangesAsync(cancellationToken);
        }
    }
}
