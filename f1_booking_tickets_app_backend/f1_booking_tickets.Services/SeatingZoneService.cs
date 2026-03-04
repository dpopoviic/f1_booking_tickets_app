using f1_booking_tickets.DataAccess;
using f1_booking_tickets.Domain.Entities;
using f1_booking_tickets.Services.If;
using Microsoft.EntityFrameworkCore;

namespace f1_booking_tickets.Services
{
    public class SeatingZoneService : ISeatingZoneService
    {
        private readonly Context _context;

        public SeatingZoneService(Context context)
        {
            _context = context;
        }

        public async Task<IReadOnlyCollection<SeatingZone>> GetByRaceIdAsync(int raceId, CancellationToken cancellationToken = default)
        {
            return await _context.SeatingZones
                .Where(sz => sz.RaceId == raceId)
                .AsNoTracking()
                .ToListAsync(cancellationToken);
        }

        public async Task<SeatingZone?> GetByIdAsync(int zoneId, CancellationToken cancellationToken = default)
        {
            return await _context.SeatingZones
                .AsNoTracking()
                .FirstOrDefaultAsync(sz => sz.ZoneId == zoneId, cancellationToken);
        }

        public async Task<SeatingZone> CreateAsync(SeatingZone seatingZone, CancellationToken cancellationToken = default)
        {
            seatingZone.CreatedAt = DateTime.UtcNow;
            seatingZone.UpdatedAt = DateTime.UtcNow;

            _context.SeatingZones.Add(seatingZone);
            await _context.SaveChangesAsync(cancellationToken);

            return seatingZone;
        }

        public async Task<SeatingZone> UpdateAsync(SeatingZone seatingZone, CancellationToken cancellationToken = default)
        {
            seatingZone.UpdatedAt = DateTime.UtcNow;

            _context.SeatingZones.Update(seatingZone);
            await _context.SaveChangesAsync(cancellationToken);

            return seatingZone;
        }

        public async Task DeleteAsync(int zoneId, CancellationToken cancellationToken = default)
        {
            var zone = await _context.SeatingZones.FindAsync([zoneId], cancellationToken);
            if (zone != null)
            {
                _context.SeatingZones.Remove(zone);
                await _context.SaveChangesAsync(cancellationToken);
            }
        }
    }
}
