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
        public int PromoCodId { get; set; }
        public string Code { get; set; } = string.Empty;
        public decimal DiscountPercentage { get; set; }
        public DateTime? ExpiryDate { get; set; }
        public PromoCodeStatus Status { get; set; }
        public DateTime CreatedAt { get; set; }
        public Ticket CreatedTicket { get; set; } = null!;
        public Ticket? UsedTicket { get; set; }

    }

    public enum PromoCodeStatus
    {
        Active,
        Inactive,
        Used
    }
}
