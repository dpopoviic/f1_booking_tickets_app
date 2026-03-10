using f1_booking_tickets.DataAccess;
using f1_booking_tickets.Services;
using f1_booking_tickets.Services.If;
using f1_booking_tickets_API.Caching;
using f1_booking_tickets_API.HostedServices;
using Microsoft.EntityFrameworkCore;
using Scalar.AspNetCore;
using StackExchange.Redis;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
builder.Services.AddOpenApi();

builder.Services.AddDbContext<Context>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.Configure<KursAPISettings>(
    builder.Configuration.GetSection(KursAPISettings.SectionName));

builder.Services.AddHttpClient<IKursAPIClient, KursAPIClient>();

builder.Services.AddScoped<IRaceService, RaceService>();
builder.Services.AddScoped<IRaceDayService, RaceDayService>();
builder.Services.AddScoped<ISeatingZoneService, SeatingZoneService>();
builder.Services.AddScoped<ITicketService, TicketService>();
builder.Services.AddScoped<ITicketModificationService, TicketModificationService>();
builder.Services.AddScoped<ITicketPurchaseService, TicketPurchaseService>();
builder.Services.AddScoped<IPromoCodeService, PromoCodeService>();
builder.Services.AddScoped<ICurrencyService, CurrencyService>();

var redisConnectionString = builder.Configuration.GetConnectionString("Redis") ?? "localhost:6379";
builder.Services.AddSingleton<IConnectionMultiplexer>(sp =>
{
    var configuration = ConfigurationOptions.Parse(redisConnectionString);
    configuration.AbortOnConnectFail = false;
    return ConnectionMultiplexer.Connect(configuration);
});

builder.Services.AddSingleton<ICacheService, RedisCacheService>();

builder.Services.AddHostedService<TicketProcessingBackgroundWorker>();
builder.Services.AddCors(options => {
    options.AddPolicy("AllowFrontend", policy => {
        policy.WithOrigins("http://localhost:3000", "http://localhost:5173")
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});
var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.MapScalarApiReference();
}
else
{
    app.UseHttpsRedirection();
}
app.UseCors("AllowFrontend");

app.UseAuthorization();

app.MapControllers();

app.Run();
