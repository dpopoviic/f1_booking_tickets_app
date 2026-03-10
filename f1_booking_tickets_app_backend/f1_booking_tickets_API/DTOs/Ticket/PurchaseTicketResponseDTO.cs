namespace f1_booking_tickets_API.DTOs.Ticket
{
    public class PurchaseTicketResponseDTO
    {
        public string TicketCode { get; set; } = string.Empty;
        public string GeneratedPromoCode { get; set; } = string.Empty;
        public decimal TotalPrice { get; set; }
        public string Currency { get; set; } = string.Empty;
        public decimal DiscountApplied { get; set; }
    }

    public static class PurchaseTicketResponseDTOExtensions
    {
        public static PurchaseTicketResponseDTO ToPurchaseTicketResponseDTO(this f1_booking_tickets.Domain.Entities.Ticket ticket)
        {
            return new PurchaseTicketResponseDTO
            {
                TicketCode = ticket.TicketCode,
                GeneratedPromoCode = ticket.CreatedPromoCode?.Code ?? string.Empty,
                TotalPrice = ticket.TotalPrice,
                Currency = ticket.Currency?.Code ?? string.Empty,
                DiscountApplied = ticket.DiscountApplied
            };
        }
    }
}
