namespace f1_booking_tickets_API.DTOs.Race
{
    public class UpdateRaceDTO
    {
        public int RaceId { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Location { get; set; } = string.Empty;
        public decimal BasePrice { get; set; }
        public DateTime? DiscountDeadline { get; set; }
    }

    public static class UpdateRaceDTOExtensions
    {
        public static f1_booking_tickets.Domain.Entities.Race ToRace(this UpdateRaceDTO dto)
        {
            return new f1_booking_tickets.Domain.Entities.Race
            {
                RaceId = dto.RaceId,
                Name = dto.Name,
                Location = dto.Location,
                BasePrice = dto.BasePrice,
                DiscountDeadline = dto.DiscountDeadline
            };
        }
    }
}
