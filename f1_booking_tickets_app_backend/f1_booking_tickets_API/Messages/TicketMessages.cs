using f1_booking_tickets.Services.If.Models;

namespace f1_booking_tickets_API.Messages
{
    public class TicketPurchaseRequestMessage
    {
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string Address { get; set; } = string.Empty;
        public string Country { get; set; } = string.Empty;
        public string PhoneNumber { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string EmailConfirmation { get; set; } = string.Empty;
        public string CurrencyCode { get; set; } = string.Empty;
        public string? PromoCode { get; set; }
        public List<TicketPurchaseItemMessage> Items { get; set; } = new();

        public TicketPurchaseRequest ToTicketPurchaseRequest()
        {
            return new TicketPurchaseRequest(
                FirstName,
                LastName,
                Address,
                Country,
                PhoneNumber,
                Email,
                EmailConfirmation,
                CurrencyCode,
                PromoCode,
                Items.Select(i => new TicketPurchaseItemRequest(i.RaceDayId, i.ZoneId)).ToList()
            );
        }
    }

    public class TicketPurchaseItemMessage
    {
        public int RaceDayId { get; set; }
        public int ZoneId { get; set; }
    }

    public class TicketModificationRequestMessage
    {
        public string TicketCode { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public int RaceDayId { get; set; }
        public int? ZoneId { get; set; }
        public string ModificationType { get; set; } = string.Empty; // "AddDay" or "RemoveDay"
    }

    public class TicketCancellationRequestMessage
    {
        public string TicketCode { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
    }
}
