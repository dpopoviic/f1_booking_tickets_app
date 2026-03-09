namespace f1_booking_tickets_API.DTOs.Race
{
    public class CreateRaceDTO
    {
        public string Name { get; set; } = string.Empty;
        public string Location { get; set; } = string.Empty;
        public decimal BasePrice { get; set; }
        public DateTime? DiscountDeadline { get; set; }
    }

    public static class CreateRaceDTOExtensions
    {
        public static f1_booking_tickets.Domain.Entities.Race ToRace(this CreateRaceDTO dto)
        {
            return new f1_booking_tickets.Domain.Entities.Race
            {
                Name = dto.Name,
                Location = dto.Location,
                BasePrice = dto.BasePrice,
                DiscountDeadline = dto.DiscountDeadline
            };
        }
    }
}
