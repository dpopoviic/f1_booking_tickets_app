using f1_booking_tickets_API.Configuration;
using Microsoft.AspNetCore.Mvc;
using StackExchange.Redis;
using System.Collections.Concurrent;
using System.Text.Json;

namespace f1_booking_tickets_API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TicketEventsController : ControllerBase
    {
        private readonly IConnectionMultiplexer _connectionMultiplexer;
        private readonly ILogger<TicketEventsController> _logger;
        private static readonly ConcurrentQueue<string> _recentEvents = new();
        private const int MaxRecentEvents = 100;

        public TicketEventsController(
            IConnectionMultiplexer connectionMultiplexer,
            ILogger<TicketEventsController> logger)
        {
            _connectionMultiplexer = connectionMultiplexer;
            _logger = logger;
        }

        [HttpGet("subscribe")]
        public async Task<IActionResult> SubscribeToEvents(CancellationToken cancellationToken)
        {
            Response.Headers.Append("Content-Type", "text/event-stream");
            Response.Headers.Append("Cache-Control", "no-cache");
            Response.Headers.Append("Connection", "keep-alive");

            var subscriber = _connectionMultiplexer.GetSubscriber();
            var channel = RedisChannel.Literal(RedisQueueNames.TicketEventsChannel);

            var queue = new ConcurrentQueue<string>();
            var tcs = new TaskCompletionSource();

            await subscriber.SubscribeAsync(channel, (ch, message) =>
            {
                if (message.HasValue)
                {
                    queue.Enqueue(message!);
                }
            });

            try
            {
                while (!cancellationToken.IsCancellationRequested)
                {
                    if (queue.TryDequeue(out var message))
                    {
                        await Response.WriteAsync($"data: {message}\n\n", cancellationToken);
                        await Response.Body.FlushAsync(cancellationToken);
                        
                        _recentEvents.Enqueue(message);
                        while (_recentEvents.Count > MaxRecentEvents)
                        {
                            _recentEvents.TryDequeue(out _);
                        }
                    }
                    else
                    {
                        await Task.Delay(100, cancellationToken);
                    }
                }
            }
            catch (OperationCanceledException)
            {
            }
            finally
            {
                await subscriber.UnsubscribeAsync(channel);
            }

            return new EmptyResult();
        }

        [HttpGet("recent")]
        public IActionResult GetRecentEvents([FromQuery] int count = 10)
        {
            var events = _recentEvents.TakeLast(Math.Min(count, MaxRecentEvents));
            return Ok(events);
        }

        [HttpPost("publish-test")]
        public async Task<IActionResult> PublishTestEvent([FromBody] object eventData)
        {
            try
            {
                var subscriber = _connectionMultiplexer.GetSubscriber();
                var message = JsonSerializer.Serialize(eventData);
                
                await subscriber.PublishAsync(
                    RedisChannel.Literal(RedisQueueNames.TicketEventsChannel),
                    message);

                return Ok(new { message = "Test event published successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error publishing test event");
                return StatusCode(500, "Failed to publish test event");
            }
        }
    }
}
