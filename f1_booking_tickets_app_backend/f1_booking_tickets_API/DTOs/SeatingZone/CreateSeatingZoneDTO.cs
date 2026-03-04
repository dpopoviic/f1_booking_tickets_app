namespace f1_booking_tickets_API.DTOs.SeatingZone
{
    public class CreateSeatingZoneDTO
    {
        public int RaceId { get; set; }
        public string Name { get; set; } = string.Empty;
        public int Capacity { get; set; }
        public decimal PriceMultiplier { get; set; }
    }

    public static class CreateSeatingZoneDTOExtensions
    {
        public static f1_booking_tickets.Domain.Entities.SeatingZone ToSeatingZone(this CreateSeatingZoneDTO dto)
        {
            return new f1_booking_tickets.Domain.Entities.SeatingZone
            {
                RaceId = dto.RaceId,
                Name = dto.Name,
                Capacity = dto.Capacity,
                PriceMultiplier = dto.PriceMultiplier
            };
        }
    }
}
