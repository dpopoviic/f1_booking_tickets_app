namespace f1_booking_tickets_API.DTOs.Ticket
{
    public class ModifyTicketDTO
    {
        public string TicketCode { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public int RaceDayId { get; set; }
        public int ZoneId { get; set; }
    }
}
