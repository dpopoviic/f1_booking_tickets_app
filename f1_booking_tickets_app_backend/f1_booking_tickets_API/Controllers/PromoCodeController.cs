using f1_booking_tickets.Domain.Entities;
using f1_booking_tickets.Services.If;
using f1_booking_tickets_API.DTOs.PromoCode;
using Microsoft.AspNetCore.Mvc;

namespace f1_booking_tickets_API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PromoCodeController : ControllerBase
    {
        private readonly IPromoCodeService _promoCodeService;

        public PromoCodeController(IPromoCodeService promoCodeService)
        {
            _promoCodeService = promoCodeService;
        }

        [HttpPost("validate")]
        public async Task<ActionResult<ValidatePromoCodeResponseDTO>> Validate([FromBody] ValidatePromoCodeRequestDTO request)
        {
            var code = request.Code?.Trim();
            if (string.IsNullOrWhiteSpace(code))
            {
                return Ok(new ValidatePromoCodeResponseDTO
                {
                    IsValid = false,
                    Message = "Promo code is required."
                });
            }

            var promoCode = await _promoCodeService.GetByCodeAsync(code.ToUpperInvariant());
            if (promoCode == null)
            {
                return Ok(new ValidatePromoCodeResponseDTO
                {
                    IsValid = false,
                    Message = "Promo code does not exist."
                });
            }

            if (promoCode.Status != PromoCodeStatus.Active)
            {
                return Ok(new ValidatePromoCodeResponseDTO
                {
                    IsValid = false,
                    Message = "Promo code is not active."
                });
            }

            if (promoCode.ExpiryDate.HasValue && promoCode.ExpiryDate.Value < DateTime.UtcNow)
            {
                return Ok(new ValidatePromoCodeResponseDTO
                {
                    IsValid = false,
                    Message = "Promo code has expired."
                });
            }

            return Ok(new ValidatePromoCodeResponseDTO
            {
                IsValid = true,
                DiscountPercentage = promoCode.DiscountPercentage,
                Message = "Promo code is valid."
            });
        }
    }
}
