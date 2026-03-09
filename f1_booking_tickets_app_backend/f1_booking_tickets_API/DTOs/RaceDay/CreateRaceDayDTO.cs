namespace f1_booking_tickets_API.DTOs.RaceDay
{
    public class CreateRaceDayDTO
    {
        public int RaceId { get; set; }
        public DateTime Date { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public decimal DayPrice { get; set; }
        public int Capacity { get; set; }
    }

    public static class CreateRaceDayDTOExtensions
    {
        public static f1_booking_tickets.Domain.Entities.RaceDay ToRaceDay(this CreateRaceDayDTO dto)
        {
            return new f1_booking_tickets.Domain.Entities.RaceDay
            {
                RaceId = dto.RaceId,
                Date = dto.Date,
                Name = dto.Name,
                Description = dto.Description,
                DayPrice = dto.DayPrice,
                Capacity = dto.Capacity,
                SoldTickets = 0
            };
        }
    }
}
