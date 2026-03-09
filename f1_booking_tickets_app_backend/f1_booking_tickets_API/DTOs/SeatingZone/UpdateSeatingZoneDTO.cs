namespace f1_booking_tickets_API.DTOs.SeatingZone
{
    public class UpdateSeatingZoneDTO
    {
        public int ZoneId { get; set; }
        public string Name { get; set; } = string.Empty;
        public int Capacity { get; set; }
        public decimal PriceMultiplier { get; set; }
    }

    public static class UpdateSeatingZoneDTOExtensions
    {
        public static f1_booking_tickets.Domain.Entities.SeatingZone ToSeatingZone(this UpdateSeatingZoneDTO dto)
        {
            return new f1_booking_tickets.Domain.Entities.SeatingZone
            {
                ZoneId = dto.ZoneId,
                Name = dto.Name,
                Capacity = dto.Capacity,
                PriceMultiplier = dto.PriceMultiplier
            };
        }
    }
}
