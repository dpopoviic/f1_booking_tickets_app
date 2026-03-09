using f1_booking_tickets.Domain.Entities;

namespace f1_booking_tickets.Services.If
{
    public interface IRaceDayService
    {
        Task<IReadOnlyCollection<RaceDay>> GetByRaceIdAsync(int raceId, CancellationToken cancellationToken = default);
        Task<RaceDay?> GetByIdAsync(int raceDayId, CancellationToken cancellationToken = default);
        Task<RaceDay> CreateAsync(RaceDay raceDay, CancellationToken cancellationToken = default);
        Task<RaceDay> UpdateAsync(RaceDay raceDay, CancellationToken cancellationToken = default);
        Task DeleteAsync(int raceDayId, CancellationToken cancellationToken = default);
    }
}
