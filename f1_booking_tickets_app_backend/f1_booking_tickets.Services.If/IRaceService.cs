using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using f1_booking_tickets.Domain.Entities;

namespace f1_booking_tickets.Services.If
{
    public interface IRaceService
    {
        Task<IReadOnlyCollection<Race>> GetAllAsync(CancellationToken cancellationToken = default);
        Task<Race?> GetByIdAsync(int raceId, CancellationToken cancellationToken = default);
        Task<Race?> GetNextUpcomingAsync(CancellationToken cancellationToken = default);
        Task<Race> CreateAsync(Race race, CancellationToken cancellationToken = default);
        Task<Race> UpdateAsync(Race race, CancellationToken cancellationToken = default);
        Task DeleteAsync(int raceId, CancellationToken cancellationToken = default);
    }
}
