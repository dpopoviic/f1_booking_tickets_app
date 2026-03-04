using f1_booking_tickets.DataAccess;
using f1_booking_tickets.Domain.Entities;
using f1_booking_tickets.Services.If;
using Microsoft.EntityFrameworkCore;

namespace f1_booking_tickets.Services
{
    public class TicketModificationService : ITicketModificationService
    {
        private readonly Context _context;
        private readonly ICurrencyService _currencyService;

        public TicketModificationService(Context context, ICurrencyService currencyService)
        {
            _context = context;
            _currencyService = currencyService;
        }

        public async Task<Ticket> AddRaceDayAsync(string ticketCode, string email, int raceDayId, int zoneId, CancellationToken cancellationToken = default)
        {
            var ticket = await _context.Tickets
                .Include(t => t.Currency)
                .Include(t => t.TicketRaceDays)
                    .ThenInclude(trd => trd.RaceDay)
                        .ThenInclude(rd => rd.Race)
                .Include(t => t.TicketRaceDays)
                    .ThenInclude(trd => trd.SeatingZone)
                .FirstOrDefaultAsync(t => t.TicketCode == ticketCode && t.Email == email, cancellationToken);

            if (ticket == null)
                throw new InvalidOperationException("Ticket not found");

            if (!ticket.IsActive)
                throw new InvalidOperationException("Cannot modify cancelled ticket");

            if (ticket.TicketRaceDays.Any(trd => trd.RaceDayId == raceDayId))
                throw new InvalidOperationException("Race day already added to this ticket");

            var raceDay = await _context.RaceDays
                .Include(rd => rd.Race)
                .FirstOrDefaultAsync(rd => rd.RaceDayId == raceDayId, cancellationToken);

            if (raceDay == null)
                throw new InvalidOperationException("Race day not found");

            if (raceDay.SoldTickets >= raceDay.Capacity)
                throw new InvalidOperationException("No available seats for this race day");

            var zone = await _context.SeatingZones
                .FirstOrDefaultAsync(z => z.ZoneId == zoneId && z.RaceId == raceDay.RaceId, cancellationToken);

            if (zone == null)
                throw new InvalidOperationException("Seating zone not found");

            var price = CalculatePrice(raceDay, zone, raceDay.Race, ticket.UsedPromoCodeId.HasValue);

            var ticketRaceDay = new TicketRaceDay
            {
                TicketId = ticket.TicketId,
                RaceDayId = raceDayId,
                ZoneId = zoneId,
                Price = price,
                CreatedAt = DateTime.UtcNow
            };

            ticket.TicketRaceDays.Add(ticketRaceDay);
            ticket.TotalPrice += price;
            ticket.UpdatedAt = DateTime.UtcNow;

            raceDay.SoldTickets++;

            await _context.SaveChangesAsync(cancellationToken);

            return ticket;
        }

        public async Task<Ticket> RemoveRaceDayAsync(string ticketCode, string email, int raceDayId, CancellationToken cancellationToken = default)
        {
            var ticket = await _context.Tickets
                .Include(t => t.TicketRaceDays)
                    .ThenInclude(trd => trd.RaceDay)
                .FirstOrDefaultAsync(t => t.TicketCode == ticketCode && t.Email == email, cancellationToken);

            if (ticket == null)
                throw new InvalidOperationException("Ticket not found");

            if (!ticket.IsActive)
                throw new InvalidOperationException("Cannot modify cancelled ticket");

            var ticketRaceDay = ticket.TicketRaceDays.FirstOrDefault(trd => trd.RaceDayId == raceDayId);

            if (ticketRaceDay == null)
                throw new InvalidOperationException("Race day not found on this ticket");

            if (ticket.TicketRaceDays.Count == 1)
                throw new InvalidOperationException("Cannot remove last race day. Cancel the ticket instead.");

            ticket.TicketRaceDays.Remove(ticketRaceDay);
            ticket.TotalPrice -= ticketRaceDay.Price;
            ticket.UpdatedAt = DateTime.UtcNow;

            var raceDay = ticketRaceDay.RaceDay;
            raceDay.SoldTickets--;

            _context.TicketRaceDays.Remove(ticketRaceDay);
            await _context.SaveChangesAsync(cancellationToken);

            return ticket;
        }

        private static decimal CalculatePrice(RaceDay raceDay, SeatingZone zone, Race race, bool hasPromoCode)
        {
            var basePrice = raceDay.DayPrice;
            var zonePrice = basePrice * zone.PriceMultiplier;

            if (race.DiscountDeadline.HasValue && DateTime.UtcNow <= race.DiscountDeadline.Value)
            {
                zonePrice *= 0.90m;
            }

            if (hasPromoCode)
            {
                zonePrice *= 0.95m;
            }

            return zonePrice;
        }
    }
}
