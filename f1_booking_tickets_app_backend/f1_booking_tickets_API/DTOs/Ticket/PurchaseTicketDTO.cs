namespace f1_booking_tickets_API.DTOs.Ticket
{
    public class PurchaseTicketDTO
    {
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string Address { get; set; } = string.Empty;
        public string Country { get; set; } = string.Empty;
        public string PhoneNumber { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string EmailConfirmation { get; set; } = string.Empty;
        public string CurrencyCode { get; set; } = "EUR";
        public string? PromoCode { get; set; }
        public List<PurchaseTicketItemDTO> Items { get; set; } = new();
    }

    public class PurchaseTicketItemDTO
    {
        public int RaceDayId { get; set; }
        public int ZoneId { get; set; }
    }

    public static class PurchaseTicketDTOExtensions
    {
        public static f1_booking_tickets.Services.If.Models.TicketPurchaseRequest ToTicketPurchaseRequest(this PurchaseTicketDTO dto)
        {
            return new f1_booking_tickets.Services.If.Models.TicketPurchaseRequest(
                dto.FirstName,
                dto.LastName,
                dto.Address,
                dto.Country,
                dto.PhoneNumber,
                dto.Email,
                dto.EmailConfirmation,
                dto.CurrencyCode,
                dto.PromoCode,
                dto.Items.Select(i => new f1_booking_tickets.Services.If.Models.TicketPurchaseItemRequest(i.RaceDayId, i.ZoneId)).ToList()
            );
        }
    }
}
