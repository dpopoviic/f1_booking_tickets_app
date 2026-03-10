using f1_booking_tickets.DataAccess;
using f1_booking_tickets.Domain.Entities;
using f1_booking_tickets.Services.If;
using Microsoft.EntityFrameworkCore;

namespace f1_booking_tickets.Services
{
    public class RaceService : IRaceService
    {
        private readonly Context _context;

        public RaceService(Context context)
        {
            _context = context;
        }

        public async Task<IReadOnlyCollection<Race>> GetAllAsync(CancellationToken cancellationToken = default)
        {
            return await _context.Races
                .AsNoTracking()
                .ToListAsync(cancellationToken);
        }

        public async Task<Race?> GetByIdAsync(int raceId, CancellationToken cancellationToken = default)
        {
            return await _context.Races
                .Include(r => r.RaceDays.OrderBy(rd => rd.Date))
                .Include(r => r.SeatingZones)
                .AsNoTracking()
                .FirstOrDefaultAsync(r => r.RaceId == raceId, cancellationToken);
        }

        public async Task<Race?> GetNextUpcomingAsync(CancellationToken cancellationToken = default)
        {
            var today = DateTime.UtcNow.Date;

            var nextRaceId = await _context.RaceDays
                .AsNoTracking()
                .Where(rd => rd.Date >= today)
                .OrderBy(rd => rd.Date)
                .Select(rd => rd.RaceId)
                .FirstOrDefaultAsync(cancellationToken);

            if (nextRaceId == 0)
            {
                return null;
            }

            return await _context.Races
                .Include(r => r.RaceDays.OrderBy(rd => rd.Date))
                .Include(r => r.SeatingZones)
                .AsNoTracking()
                .FirstOrDefaultAsync(r => r.RaceId == nextRaceId, cancellationToken);
        }

        public async Task<Race> CreateAsync(Race race, CancellationToken cancellationToken = default)
        {
            race.CreatedAt = DateTime.UtcNow;
            race.UpdatedAt = DateTime.UtcNow;

            _context.Races.Add(race);
            await _context.SaveChangesAsync(cancellationToken);

            return race;
        }

        public async Task<Race> UpdateAsync(Race race, CancellationToken cancellationToken = default)
        {
            race.UpdatedAt = DateTime.UtcNow;

            _context.Races.Update(race);
            await _context.SaveChangesAsync(cancellationToken);

            return race;
        }

        public async Task DeleteAsync(int raceId, CancellationToken cancellationToken = default)
        {
            var race = await _context.Races.FindAsync([raceId], cancellationToken);
            if (race != null)
            {
                _context.Races.Remove(race);
                await _context.SaveChangesAsync(cancellationToken);
            }
        }
    }
}
