using f1_booking_tickets.Domain.Entities;

namespace f1_booking_tickets.Services.If
{
    public interface ISeatingZoneService
    {
        Task<IReadOnlyCollection<SeatingZone>> GetByRaceIdAsync(int raceId, CancellationToken cancellationToken = default);
        Task<SeatingZone?> GetByIdAsync(int zoneId, CancellationToken cancellationToken = default);
        Task<SeatingZone> CreateAsync(SeatingZone seatingZone, CancellationToken cancellationToken = default);
        Task<SeatingZone> UpdateAsync(SeatingZone seatingZone, CancellationToken cancellationToken = default);
        Task DeleteAsync(int zoneId, CancellationToken cancellationToken = default);
    }
}
