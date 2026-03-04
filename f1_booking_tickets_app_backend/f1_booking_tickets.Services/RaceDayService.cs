using f1_booking_tickets.DataAccess;
using f1_booking_tickets.Domain.Entities;
using f1_booking_tickets.Services.If;
using Microsoft.EntityFrameworkCore;

namespace f1_booking_tickets.Services
{
    public class RaceDayService : IRaceDayService
    {
        private readonly Context _context;

        public RaceDayService(Context context)
        {
            _context = context;
        }

        public async Task<IReadOnlyCollection<RaceDay>> GetByRaceIdAsync(int raceId, CancellationToken cancellationToken = default)
        {
            return await _context.RaceDays
                .Where(rd => rd.RaceId == raceId)
                .AsNoTracking()
                .ToListAsync(cancellationToken);
        }

        public async Task<RaceDay?> GetByIdAsync(int raceDayId, CancellationToken cancellationToken = default)
        {
            return await _context.RaceDays
                .AsNoTracking()
                .FirstOrDefaultAsync(rd => rd.RaceDayId == raceDayId, cancellationToken);
        }

        public async Task<RaceDay> CreateAsync(RaceDay raceDay, CancellationToken cancellationToken = default)
        {
            raceDay.CreatedAt = DateTime.UtcNow;
            raceDay.UpdatedAt = DateTime.UtcNow;

            _context.RaceDays.Add(raceDay);
            await _context.SaveChangesAsync(cancellationToken);

            return raceDay;
        }

        public async Task<RaceDay> UpdateAsync(RaceDay raceDay, CancellationToken cancellationToken = default)
        {
            raceDay.UpdatedAt = DateTime.UtcNow;

            _context.RaceDays.Update(raceDay);
            await _context.SaveChangesAsync(cancellationToken);

            return raceDay;
        }

        public async Task DeleteAsync(int raceDayId, CancellationToken cancellationToken = default)
        {
            var raceDay = await _context.RaceDays.FindAsync([raceDayId], cancellationToken);
            if (raceDay != null)
            {
                _context.RaceDays.Remove(raceDay);
                await _context.SaveChangesAsync(cancellationToken);
            }
        }
    }
}
