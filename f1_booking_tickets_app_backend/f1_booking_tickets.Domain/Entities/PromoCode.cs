using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Sockets;
using System.Text;
using System.Threading.Tasks;

namespace f1_booking_tickets.Domain.Entities
{
    public class PromoCode
    {
        public int PromoCodeId { get; set; }
        public string Code { get; set; } = string.Empty;
        public decimal DiscountPercentage { get; set; }
        public DateTime? ExpiryDate { get; set; }
        public PromoCodeStatus Status { get; set; }
        public DateTime CreatedAt { get; set; }
        public int CreatedByTicketId { get; set; }
        public Ticket CreatedByTicket { get; set; } = null!;
        public int? UsedByTicketId { get; set; }
        public Ticket? UsedByTicket { get; set; }
    }

    public enum PromoCodeStatus
    {
        Active,
        Inactive,
        Used
    }
}
