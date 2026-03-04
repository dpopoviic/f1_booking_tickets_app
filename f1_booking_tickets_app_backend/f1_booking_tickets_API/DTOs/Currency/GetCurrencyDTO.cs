namespace f1_booking_tickets_API.DTOs.Currency
{
    public class GetCurrencyDTO
    {
        public int CurrencyId { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Code { get; set; } = string.Empty;
    }

    public static class GetCurrencyDTOExtensions
    {
        public static GetCurrencyDTO ToGetCurrencyDTO(this f1_booking_tickets.Domain.Entities.Currency currency)
        {
            return new GetCurrencyDTO
            {
                CurrencyId = currency.CurrencyId,
                Name = currency.Name,
                Code = currency.Code
            };
        }
    }
}
