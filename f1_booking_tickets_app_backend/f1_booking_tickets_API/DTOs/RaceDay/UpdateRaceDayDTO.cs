namespace f1_booking_tickets_API.DTOs.RaceDay
{
    public class UpdateRaceDayDTO
    {
        public int RaceDayId { get; set; }
        public DateTime Date { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public decimal DayPrice { get; set; }
        public int Capacity { get; set; }
    }

    public static class UpdateRaceDayDTOExtensions
    {
        public static f1_booking_tickets.Domain.Entities.RaceDay ToRaceDay(this UpdateRaceDayDTO dto)
        {
            return new f1_booking_tickets.Domain.Entities.RaceDay
            {
                RaceDayId = dto.RaceDayId,
                Date = dto.Date,
                Name = dto.Name,
                Description = dto.Description,
                DayPrice = dto.DayPrice,
                Capacity = dto.Capacity
            };
        }
    }
}
