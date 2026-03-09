using f1_booking_tickets_API.DTOs.RaceDay;
using f1_booking_tickets_API.DTOs.SeatingZone;

namespace f1_booking_tickets_API.DTOs.Ticket
{
    public class GetTicketDetailsDTO
    {
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
        public string CurrencyCode { get; set; } = string.Empty;
        public string GeneratedPromoCode { get; set; } = string.Empty;
        public string? UsedPromoCode { get; set; }
        public List<TicketRaceDayItemDTO> Items { get; set; } = new();
    }

    public class TicketRaceDayItemDTO
    {
        public int RaceDayId { get; set; }
        public string RaceDayName { get; set; } = string.Empty;
        public DateTime Date { get; set; }
        public int ZoneId { get; set; }
        public string ZoneName { get; set; } = string.Empty;
        public decimal Price { get; set; }
    }

    public static class GetTicketDetailsDTOExtensions
    {
        public static GetTicketDetailsDTO ToGetTicketDetailsDTO(this f1_booking_tickets.Domain.Entities.Ticket ticket)
        {
            return new GetTicketDetailsDTO
            {
                TicketCode = ticket.TicketCode,
                FirstName = ticket.FirstName,
                LastName = ticket.LastName,
                Email = ticket.Email,
                PhoneNumber = ticket.PhoneNumber,
                Address = ticket.Address,
                Country = ticket.Country,
                IsActive = ticket.IsActive,
                TotalPrice = ticket.TotalPrice,
                PurchaseDate = ticket.PurchaseDate,
                DiscountApplied = ticket.DiscountApplied,
                CurrencyCode = ticket.Currency.Code,
                GeneratedPromoCode = ticket.CreatedPromoCode?.Code ?? string.Empty,
                UsedPromoCode = ticket.UsedPromoCode?.Code,
                Items = ticket.TicketRaceDays.Select(trd => new TicketRaceDayItemDTO
                {
                    RaceDayId = trd.RaceDayId,
                    RaceDayName = trd.RaceDay.Name,
                    Date = trd.RaceDay.Date,
                    ZoneId = trd.ZoneId,
                    ZoneName = trd.SeatingZone.Name,
                    Price = trd.Price
                }).ToList()
            };
        }
    }
}
