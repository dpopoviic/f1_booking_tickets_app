namespace f1_booking_tickets_API.DTOs.SeatingZone
{
    public class GetSeatingZoneDTO
    {
        public int SeatingZoneId { get; set; }
        public int RaceId { get; set; }
        public string Name { get; set; } = string.Empty;
        public decimal PriceMultiplier { get; set; }
        public int Capacity { get; set; }
    }
    public static class GetSeatingZoneDTOExtensions
    {
        public static GetSeatingZoneDTO ToGetSeatingZoneDTO(this f1_booking_tickets.Domain.Entities.SeatingZone seatingZone)
        {
            return new GetSeatingZoneDTO
            {
                SeatingZoneId = seatingZone.ZoneId,
                RaceId = seatingZone.RaceId,
                Name = seatingZone.Name,
                PriceMultiplier = seatingZone.PriceMultiplier,
                Capacity = seatingZone.Capacity
            };
        }
    }
}
