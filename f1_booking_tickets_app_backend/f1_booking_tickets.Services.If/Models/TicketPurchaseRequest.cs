namespace f1_booking_tickets.Services.If.Models
{
    public sealed record TicketPurchaseRequest(
        string FirstName,
        string LastName,
        string Address,
        string Country,
        string PhoneNumber,
        string Email,
        string EmailConfirmation,
        string CurrencyCode,
        string? PromoCode,
        IReadOnlyCollection<TicketPurchaseItemRequest> Items);

    public sealed record TicketPurchaseItemRequest(int RaceDayId, int ZoneId);
}
