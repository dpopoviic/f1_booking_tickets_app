using f1_booking_tickets.Domain.Entities;

namespace f1_booking_tickets_API.DTOs.Race
{
    public class GetRaceDTO
    {
        public int RaceId { get; set; }
        public string Name { get; set; } = null!;
        public string Location { get; set; } = null!;
        public decimal BasePrice { get; set; }
        public DateTime? DiscountDeadline { get; set; }
        public DateTime? StartDate { get; set; }
    }
    public static class GetRaceDTOExtensions
    {
        public static GetRaceDTO ToGetRaceDTO(this f1_booking_tickets.Domain.Entities.Race race)
        {
            return new GetRaceDTO
            {
                RaceId = race.RaceId,
                Name = race.Name,
                Location = race.Location,
                BasePrice = race.BasePrice,
                DiscountDeadline = race.DiscountDeadline,
                StartDate = race.RaceDays.Count == 0 ? null : race.RaceDays.Min(rd => rd.Date)
            };
        }
    }
}
