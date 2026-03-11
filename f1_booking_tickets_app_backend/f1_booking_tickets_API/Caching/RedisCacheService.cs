using System.Text.Json;
using f1_booking_tickets.Services.If;
using StackExchange.Redis;

namespace f1_booking_tickets_API.Caching
{
    public class RedisCacheService : ICacheService
    {
        private IDatabase Database { get; }

        public RedisCacheService(IConnectionMultiplexer connectionMultiplexer)
        {
            Database = connectionMultiplexer.GetDatabase();
        }

        public Task<T?> GetRecord<T>(string key)
        {
            var record = Database.StringGet(key);

            if (record.IsNull)
            {
                return Task.FromResult<T?>(default);
            }

            var deserializedRecord = JsonSerializer.Deserialize<T>(record!);
            return Task.FromResult(deserializedRecord);
        }

        public Task<bool> SetRecord<T>(string key, T data)
        {
            return Task.FromResult(Database.StringSet(key, JsonSerializer.Serialize(data)));
        }

        public Task<bool> SetRecord<T>(string key, T data, TimeSpan expiry)
        {
            return Task.FromResult(Database.StringSet(key, JsonSerializer.Serialize(data), expiry));
        }

        public Task<bool> DeleteRecord(string key)
        {
            return Task.FromResult(Database.KeyDelete(key));
        }
    }
}
