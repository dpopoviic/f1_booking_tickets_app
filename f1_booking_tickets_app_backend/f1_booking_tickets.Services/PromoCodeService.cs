using f1_booking_tickets.DataAccess;
using f1_booking_tickets.Domain.Entities;
using f1_booking_tickets.Services.If;
using Microsoft.EntityFrameworkCore;

namespace f1_booking_tickets.Services
{
    public class PromoCodeService : IPromoCodeService
    {
        private readonly Context _context;

        public PromoCodeService(Context context)
        {
            _context = context;
        }

        public async Task<PromoCode?> GetByCodeAsync(string code, CancellationToken cancellationToken = default)
        {
            return await _context.PromoCodes
                .AsNoTracking()
                .FirstOrDefaultAsync(pc => pc.Code == code, cancellationToken);
        }

        public async Task<PromoCode> GenerateForTicketAsync(int ticketId, CancellationToken cancellationToken = default)
        {
            var currentYear = DateTime.UtcNow.Year;
            var randomString = Guid.NewGuid().ToString("N")[..8].ToUpper();
            
            var promoCode = new PromoCode
            {
                Code = $"PROMO-{currentYear}-{randomString}",
                DiscountPercentage = 5,
                ExpiryDate = DateTime.UtcNow.AddYears(1),
                Status = PromoCodeStatus.Active,
                CreatedAt = DateTime.UtcNow,
                CreatedByTicketId = ticketId
            };

            _context.PromoCodes.Add(promoCode);
            await _context.SaveChangesAsync(cancellationToken);

            return promoCode;
        }

        public async Task<bool> TryApplyAsync(string code, int ticketId, CancellationToken cancellationToken = default)
        {
            var promoCode = await _context.PromoCodes
                .FirstOrDefaultAsync(pc => pc.Code == code, cancellationToken);

            if (promoCode == null || promoCode.Status != PromoCodeStatus.Active)
                return false;

            if (promoCode.ExpiryDate.HasValue && promoCode.ExpiryDate.Value < DateTime.UtcNow)
                return false;

            return true;
        }

        public async Task MarkAsUsedAsync(int promoCodeId, CancellationToken cancellationToken = default)
        {
            var promoCode = await _context.PromoCodes.FindAsync([promoCodeId], cancellationToken);
            if (promoCode != null)
            {
                promoCode.Status = PromoCodeStatus.Used;
                await _context.SaveChangesAsync(cancellationToken);
            }
        }

        public async Task InvalidateByTicketAsync(int ticketId, CancellationToken cancellationToken = default)
        {
            var promoCode = await _context.PromoCodes
                .FirstOrDefaultAsync(pc => pc.CreatedByTicketId == ticketId, cancellationToken);

            if (promoCode != null)
            {
                promoCode.Status = PromoCodeStatus.Inactive;
                await _context.SaveChangesAsync(cancellationToken);
            }
        }
    }
}
