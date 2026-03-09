using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace f1_portal_api.Domain.Events
{
    public class TicketEvent
    {
        public string EventType { get; set; } = string.Empty;
        public DateTime EventDate { get; set; }
        public string Data { get; set; } = string.Empty;
    }

    public class TicketPurchasedEventData
    {
        public long TicketId { get; set; }
        public string TicketCode { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Country { get; set; } = string.Empty;
        public decimal TotalPrice { get; set; }
        public DateTime PurchasedAt { get; set; }
        public List<TicketRaceDayInfo> RaceDays { get; set; } = new();
    }

    public class TicketModifiedEventData
    {
        public long TicketId { get; set; }
        public string TicketCode { get; set; } = string.Empty;
        public string ModificationType { get; set; } = string.Empty; // "AddDay" or "RemoveDay"
        public long RaceDayId { get; set; }
        public string RaceDayName { get; set; } = string.Empty;
        public string RaceDayDate { get; set; } = string.Empty;
        public DateTime ModifiedAt { get; set; }
    }

    public class TicketCancelledEventData
    {
        public long TicketId { get; set; }
        public string TicketCode { get; set; } = string.Empty;
        public DateTime CancelledAt { get; set; }
        public List<TicketRaceDayInfo> RaceDays { get; set; } = new();
    }

    public class TicketRaceDayInfo
    {
        public long RaceDayId { get; set; }
        public string RaceDayName { get; set; } = string.Empty;
        public string RaceDayDate { get; set; } = string.Empty;
    }
}
