namespace f1_booking_tickets.Services.If.Models
{
    public class KursResponse
    {
        public string Code { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public string Country { get; set; } = string.Empty;
    }

    public class KursRateResponse
    {
        public string CurrencyCode { get; set; } = string.Empty;
        public decimal ExchangeRate { get; set; }
        public decimal ExchangeMiddleRate { get; set; }
        public DateTime Date { get; set; }
    }
}
