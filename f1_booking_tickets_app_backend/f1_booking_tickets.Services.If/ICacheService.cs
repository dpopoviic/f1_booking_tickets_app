namespace f1_booking_tickets.Services.If
{
    public interface ICacheService
    {
        Task<T?> GetRecord<T>(string key);
        Task<bool> SetRecord<T>(string key, T data);
        Task<bool> DeleteRecord(string key);
    }
}
