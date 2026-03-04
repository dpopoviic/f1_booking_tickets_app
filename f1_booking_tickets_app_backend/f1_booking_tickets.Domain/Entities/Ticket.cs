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
        public string TicketCode { get; set; } = string.Empty;
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string PhoneNumber { get; set; } = string.Empty;
        public string Address { get; set; } = string.Empty;
        public string Country { get; set; } = string.Empty;
        public bool IsActive { get; set; }
        public decimal TotalPrice { get; set; }
        public DateTime PurchaseDate { get; set; }
        public decimal DiscountApplied { get; set; }
        public int CurrencyId { get; set; }
        public Currency Currency { get; set; } = null!;
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
        public ICollection<TicketRaceDay> TicketRaceDays { get; set; } = new List<TicketRaceDay>();
        public PromoCode? CreatedPromoCode { get; set; }
        public int? UsedPromoCodeId { get; set; }
        public PromoCode? UsedPromoCode { get; set; }
    }
}
