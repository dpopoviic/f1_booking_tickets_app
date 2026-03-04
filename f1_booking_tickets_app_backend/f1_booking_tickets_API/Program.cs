using f1_booking_tickets.DataAccess;
using f1_booking_tickets.Services;
using f1_booking_tickets.Services.If;
using Microsoft.EntityFrameworkCore;
using Scalar.AspNetCore;

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

app.UseAuthorization();

app.MapControllers();

app.Run();
