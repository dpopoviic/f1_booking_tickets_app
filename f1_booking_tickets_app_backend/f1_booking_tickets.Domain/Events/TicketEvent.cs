namespace f1_booking_tickets.Domain.Events
{
    public class TicketEvent
    {
        public string EventType { get; set; } = string.Empty;
        public DateTime EventDate { get; set; }
        public string Data { get; set; } = string.Empty;
    }

    public class TicketPurchasedEventData
    {
        public int TicketId { get; set; }
        public string TicketCode { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Country { get; set; } = string.Empty;
        public decimal TotalPrice { get; set; }
        public DateTime PurchasedAt { get; set; }
    }

    public class TicketModifiedEventData
    {
        public int TicketId { get; set; }
        public string TicketCode { get; set; } = string.Empty;
        public string ModificationType { get; set; } = string.Empty;
        public int RaceDayId { get; set; }
        public DateTime ModifiedAt { get; set; }
    }

    public class TicketCancelledEventData
    {
        public int TicketId { get; set; }
        public string TicketCode { get; set; } = string.Empty;
        public DateTime CancelledAt { get; set; }
    }
}
