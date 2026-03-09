using f1_booking_tickets_API.DTOs.RaceDay;
using f1_booking_tickets_API.DTOs.SeatingZone;

namespace f1_booking_tickets_API.DTOs.Race
{
    public class GetRaceDetailsDTO
    {
        public int RaceId { get; set; }
        public string Name { get; set; } = null!;
        public string Location { get; set; } = null!;
        public decimal BasePrice { get; set; }
        public DateTime? DiscountDeadline { get; set; }
        public List<GetRaceDayDTO> RaceDays { get; set; } = new List<GetRaceDayDTO>();
        public List<GetSeatingZoneDTO> SeatingZones { get; set; } = new List<GetSeatingZoneDTO>();
    }

    public static class GetRaceDetailsDTOExtensions
    {
        public static GetRaceDetailsDTO ToGetRaceDetailsDTO(this f1_booking_tickets.Domain.Entities.Race race)
        {
            return new GetRaceDetailsDTO
            {
                RaceId = race.RaceId,
                Name = race.Name,
                Location = race.Location,
                BasePrice = race.BasePrice,
                DiscountDeadline = race.DiscountDeadline,
                RaceDays = race.RaceDays.Select(rd => rd.ToGetRaceDayDTO()).ToList(),
                SeatingZones = race.SeatingZones.Select(sz => sz.ToGetSeatingZoneDTO()).ToList()
            };
        }
    }
}
