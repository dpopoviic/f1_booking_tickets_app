using System.Text.Json.Serialization;

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

    public class KursDailyRateApiResponse
    {
        [JsonPropertyName("code")]
        public string Code { get; set; } = string.Empty;

        [JsonPropertyName("date")]
        public string Date { get; set; } = string.Empty;

        [JsonPropertyName("exchange_middle")]
        public decimal ExchangeMiddle { get; set; }

        [JsonPropertyName("exchange_buy")]
        public decimal ExchangeBuy { get; set; }

        [JsonPropertyName("exchange_sell")]
        public decimal ExchangeSell { get; set; }
    }
}
