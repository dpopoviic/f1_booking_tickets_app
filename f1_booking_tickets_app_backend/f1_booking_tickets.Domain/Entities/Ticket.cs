using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace f1_booking_tickets.Domain.Entities
{
    public class Ticket
    {
        public int TicketId { get; set; }
        public int CustomerId { get; set; }
        public bool IsActive { get; set; }
        public decimal TotalPrice { get; set; }
        public DateTime PurchaseDate { get; set; }
        public decimal DiscountApplied { get; set; }
        public int CurrencyId { get; set; }
        public Currency Currency { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
        public Customer Customer { get; set; } = null!;
        public ICollection<TicketRaceDay> TicketRaceDays { get; set; } = new List<TicketRaceDay>();
        public int PromoCodeCreatedId { get; set; }
        public PromoCode PromoCodeCreated { get; set; }
        public int? PromoCodeUsedId { get; set; }
        public PromoCode? PromoCodeUsed { get; set; }
    }
}
