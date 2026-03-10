namespace f1_booking_tickets_API.DTOs.PromoCode
{
    public class ValidatePromoCodeRequestDTO
    {
        public string Code { get; set; } = string.Empty;
    }

    public class ValidatePromoCodeResponseDTO
    {
        public bool IsValid { get; set; }
        public decimal? DiscountPercentage { get; set; }
        public string? Message { get; set; }
    }
}
