using f1_booking_tickets.DataAccess;
using f1_booking_tickets.Domain.Entities;
using f1_booking_tickets.Services.If;
using f1_booking_tickets.Services.If.Models;
using Microsoft.EntityFrameworkCore;

namespace f1_booking_tickets.Services
{
    public class TicketPurchaseService : ITicketPurchaseService
    {
        private readonly Context _context;
        private readonly IPromoCodeService _promoCodeService;
        private readonly ICurrencyService _currencyService;

        public TicketPurchaseService(
            Context context,
            IPromoCodeService promoCodeService,
            ICurrencyService currencyService)
        {
            _context = context;
            _promoCodeService = promoCodeService;
            _currencyService = currencyService;
        }

        public async Task<Ticket> PurchaseAsync(TicketPurchaseRequest request, CancellationToken cancellationToken = default)
        {
            if (request.Email != request.EmailConfirmation)
                throw new InvalidOperationException("Email addresses do not match");

            if (request.Items == null || request.Items.Count == 0)
                throw new InvalidOperationException("At least one race day with seating zone must be selected");

            var duplicateRaceDayIds = request.Items
                .GroupBy(i => i.RaceDayId)
                .Where(group => group.Count() > 1)
                .Select(group => group.Key)
                .ToList();

            if (duplicateRaceDayIds.Count > 0)
                throw new InvalidOperationException("Each selected race day can only be assigned once");

            var normalizedCurrencyCode = string.IsNullOrWhiteSpace(request.CurrencyCode)
                ? "EUR"
                : request.CurrencyCode.Trim().ToUpperInvariant();

            var currency = await _currencyService.GetByCodeAsync(normalizedCurrencyCode, cancellationToken);
            if (currency == null)
                throw new InvalidOperationException($"Currency {normalizedCurrencyCode} not supported");

            PromoCode? usedPromoCode = null;
            if (!string.IsNullOrWhiteSpace(request.PromoCode))
            {
                usedPromoCode = await _promoCodeService.GetByCodeAsync(request.PromoCode, cancellationToken);
                if (usedPromoCode == null || usedPromoCode.Status != PromoCodeStatus.Active)
                    throw new InvalidOperationException("Invalid or expired promo code");

                if (usedPromoCode.ExpiryDate.HasValue && usedPromoCode.ExpiryDate.Value < DateTime.UtcNow)
                    throw new InvalidOperationException("Promo code has expired");
            }

            var raceDayIds = request.Items.Select(i => i.RaceDayId).Distinct().ToList();
            var raceDays = await _context.RaceDays
                .Include(rd => rd.Race)
                .Where(rd => raceDayIds.Contains(rd.RaceDayId))
                .ToListAsync(cancellationToken);

            if (raceDays.Count != raceDayIds.Count)
                throw new InvalidOperationException("One or more race days not found");

            var distinctRaces = raceDays.Select(rd => rd.RaceId).Distinct();
            if (distinctRaces.Count() > 1)
                throw new InvalidOperationException("All race days must belong to the same race");

            var zoneIds = request.Items.Select(i => i.ZoneId).Distinct().ToList();
            var zones = await _context.SeatingZones
                .Where(z => zoneIds.Contains(z.ZoneId))
                .ToListAsync(cancellationToken);

            if (zones.Count != zoneIds.Count)
                throw new InvalidOperationException("One or more seating zones not found");

            foreach (var item in request.Items)
            {
                var raceDay = raceDays.First(rd => rd.RaceDayId == item.RaceDayId);
                var zone = zones.First(z => z.ZoneId == item.ZoneId);

                if (zone.RaceId != raceDay.RaceId)
                    throw new InvalidOperationException($"Seating zone {zone.Name} does not belong to the race of day {raceDay.Name}");
            }

            foreach (var raceDay in raceDays)
            {
                if (raceDay.SoldTickets >= raceDay.Capacity)
                    throw new InvalidOperationException($"Race day {raceDay.Name} is sold out");
            }

            decimal exchangeRate = 1m;
            if (normalizedCurrencyCode != "EUR")
            {
                exchangeRate = await _currencyService.GetExchangeRateAsync("EUR", normalizedCurrencyCode, cancellationToken);
            }

            var currentYear = DateTime.UtcNow.Year;
            var randomString = Guid.NewGuid().ToString("N")[..8].ToUpper();
            var ticketCode = $"F1-{currentYear}-{randomString}";

            var ticket = new Ticket
            {
                TicketCode = ticketCode,
                FirstName = request.FirstName,
                LastName = request.LastName,
                Email = request.Email,
                PhoneNumber = request.PhoneNumber,
                Address = request.Address,
                Country = request.Country,
                IsActive = true,
                PurchaseDate = DateTime.UtcNow,
                CurrencyId = currency.CurrencyId,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            decimal totalPrice = 0;
            decimal totalDiscount = 0;

            foreach (var item in request.Items)
            {
                var raceDay = raceDays.First(rd => rd.RaceDayId == item.RaceDayId);
                var zone = zones.First(z => z.ZoneId == item.ZoneId);

                var basePrice = raceDay.DayPrice * zone.PriceMultiplier;
                var itemPrice = basePrice;
                decimal itemDiscount = 0;

                if (raceDay.Race.DiscountDeadline.HasValue && DateTime.UtcNow <= raceDay.Race.DiscountDeadline.Value)
                {
                    itemDiscount += itemPrice * 0.10m;
                    itemPrice *= 0.90m;
                }

                if (usedPromoCode != null)
                {
                    itemDiscount += itemPrice * 0.05m;
                    itemPrice *= 0.95m;
                }

                // Convert from EUR to selected currency
                itemPrice *= exchangeRate;
                itemDiscount *= exchangeRate;

                var ticketRaceDay = new TicketRaceDay
                {
                    RaceDayId = item.RaceDayId,
                    ZoneId = item.ZoneId,
                    Price = itemPrice,
                    CreatedAt = DateTime.UtcNow
                };

                ticket.TicketRaceDays.Add(ticketRaceDay);
                totalPrice += itemPrice;
                totalDiscount += itemDiscount;

                raceDay.SoldTickets++;
            }

            ticket.TotalPrice = totalPrice;
            ticket.DiscountApplied = totalDiscount;

            if (usedPromoCode != null)
            {
                ticket.UsedPromoCodeId = usedPromoCode.PromoCodeId;
                usedPromoCode.Status = PromoCodeStatus.Used;
                usedPromoCode.UsedByTicketId = ticket.TicketId;
            }

            _context.Tickets.Add(ticket);
            await _context.SaveChangesAsync(cancellationToken);

            var generatedPromoCode = await _promoCodeService.GenerateForTicketAsync(ticket.TicketId, cancellationToken);
            ticket.CreatedPromoCode = generatedPromoCode;

            return ticket;
        }
    }
}
