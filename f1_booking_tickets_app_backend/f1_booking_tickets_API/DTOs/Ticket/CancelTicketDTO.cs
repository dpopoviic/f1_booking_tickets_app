namespace f1_booking_tickets_API.DTOs.Ticket
{
    public class CancelTicketDTO
    {
        public string TicketCode { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
    }
}
