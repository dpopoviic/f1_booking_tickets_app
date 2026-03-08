namespace f1_booking_tickets_API.Configuration
{
    public static class RedisQueueNames
    {
        public const string TicketPurchaseQueue = "ticket_purchase_queue";
        public const string TicketModificationQueue = "ticket_modification_queue";
        public const string TicketCancellationQueue = "ticket_cancellation_queue";
        public const string TicketEventsChannel = "ticket_events";
    }
}
