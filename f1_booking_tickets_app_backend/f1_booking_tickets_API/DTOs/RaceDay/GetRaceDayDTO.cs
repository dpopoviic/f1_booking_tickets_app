namespace f1_booking_tickets_API.DTOs.RaceDay
{
    public class GetRaceDayDTO
    {
        public int RaceDayId { get; set; }
        public int RaceId { get; set; }
        public DateTime Date { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public decimal DayPrice { get; set; }
        public int Capacity { get; set; }

    }
    public static class GetRaceDayDTOExtensions
    {
        public static GetRaceDayDTO ToGetRaceDayDTO(this f1_booking_tickets.Domain.Entities.RaceDay raceDay)
        {
            return new GetRaceDayDTO
            {
                RaceDayId = raceDay.RaceDayId,
                RaceId = raceDay.RaceId,
                Date = raceDay.Date,
                Name = raceDay.Name,
                Description = raceDay.Description,
                DayPrice = raceDay.DayPrice,
                Capacity = raceDay.Capacity
            };
        }
    }
}
