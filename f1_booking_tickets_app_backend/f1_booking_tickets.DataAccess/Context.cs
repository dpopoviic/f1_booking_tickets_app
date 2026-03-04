using f1_booking_tickets.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace f1_booking_tickets.DataAccess
{
    public class Context : DbContext
    {
        public Context(DbContextOptions<Context> options) : base(options)
        {
        }
        public DbSet<Race> Races { get; set; }
        public DbSet<RaceDay> RaceDays { get; set; }
        public DbSet<SeatingZone> SeatingZones { get; set; }
        public DbSet<Ticket> Tickets { get; set; }
        public DbSet<TicketRaceDay> TicketRaceDays { get; set; }
        public DbSet<PromoCode> PromoCodes { get; set; }
        public DbSet<Currency> Currencies { get; set; }
        
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Race>(entity =>
            {
                entity.HasKey(e => e.RaceId);

                entity.Property(e => e.Name)
                    .IsRequired()
                    .HasMaxLength(200);

                entity.Property(e => e.Location)
                    .IsRequired()
                    .HasMaxLength(200);

                entity.Property(e => e.BasePrice)
                    .HasPrecision(18, 2)
                    .IsRequired();

                entity.Property(e => e.DiscountDeadline);

                entity.Property(e => e.CreatedAt)
                    .HasDefaultValueSql("GETUTCDATE()")
                    .ValueGeneratedOnAdd();

                entity.Property(e => e.UpdatedAt)
                    .HasDefaultValueSql("GETUTCDATE()")
                    .ValueGeneratedOnAddOrUpdate();

                entity.HasMany(e => e.RaceDays)
                    .WithOne(rd => rd.Race)
                    .HasForeignKey(rd => rd.RaceId)
                    .OnDelete(DeleteBehavior.Cascade);

                entity.HasMany(e => e.SeatingZones)
                    .WithOne(sz => sz.Race)
                    .HasForeignKey(sz => sz.RaceId)
                    .OnDelete(DeleteBehavior.Cascade);
            });

            modelBuilder.Entity<RaceDay>(entity =>
            {
                entity.HasKey(e => e.RaceDayId);

                entity.Property(e => e.Date)
                    .IsRequired();

                entity.Property(e => e.Name)
                    .IsRequired()
                    .HasMaxLength(100);

                entity.Property(e => e.Description)
                    .HasMaxLength(500);

                entity.Property(e => e.DayPrice)
                    .HasPrecision(18, 2)
                    .IsRequired();

                entity.Property(e => e.Capacity)
                    .IsRequired();

                entity.Property(e => e.SoldTickets)
                    .IsRequired()
                    .HasDefaultValue(0);

                entity.Property(e => e.CreatedAt)
                    .HasDefaultValueSql("GETUTCDATE()")
                    .ValueGeneratedOnAdd();

                entity.Property(e => e.UpdatedAt)
                    .HasDefaultValueSql("GETUTCDATE()")
                    .ValueGeneratedOnAddOrUpdate();

                entity.HasOne(e => e.Race)
                    .WithMany(r => r.RaceDays)
                    .HasForeignKey(e => e.RaceId)
                    .OnDelete(DeleteBehavior.Cascade);

                entity.HasIndex(e => e.RaceId);
                entity.HasIndex(e => e.Date);
            });

            modelBuilder.Entity<SeatingZone>(entity =>
            {
                entity.HasKey(e => e.ZoneId);

                entity.Property(e => e.Name)
                    .IsRequired()
                    .HasMaxLength(100);

                entity.Property(e => e.Capacity)
                    .IsRequired();

                entity.Property(e => e.PriceMultiplier)
                    .HasPrecision(18, 2)
                    .IsRequired();

                entity.Property(e => e.CreatedAt)
                    .HasDefaultValueSql("GETUTCDATE()")
                    .ValueGeneratedOnAdd();

                entity.Property(e => e.UpdatedAt)
                    .HasDefaultValueSql("GETUTCDATE()")
                    .ValueGeneratedOnAddOrUpdate();

                entity.HasOne(e => e.Race)
                    .WithMany(r => r.SeatingZones)
                    .HasForeignKey(e => e.RaceId)
                    .OnDelete(DeleteBehavior.Cascade);

                entity.HasIndex(e => e.RaceId);
            });

            modelBuilder.Entity<Ticket>(entity =>
            {
                entity.HasKey(e => e.TicketId);

                entity.Property(e => e.TicketCode)
                    .IsRequired()
                    .HasMaxLength(50);

                entity.Property(e => e.FirstName)
                    .IsRequired()
                    .HasMaxLength(100);

                entity.Property(e => e.LastName)
                    .IsRequired()
                    .HasMaxLength(100);

                entity.Property(e => e.Email)
                    .IsRequired()
                    .HasMaxLength(256);

                entity.Property(e => e.PhoneNumber)
                    .IsRequired()
                    .HasMaxLength(20);

                entity.Property(e => e.Address)
                    .IsRequired()
                    .HasMaxLength(500);

                entity.Property(e => e.Country)
                    .IsRequired()
                    .HasMaxLength(100);

                entity.Property(e => e.IsActive)
                    .IsRequired()
                    .HasDefaultValue(true);

                entity.Property(e => e.TotalPrice)
                    .HasPrecision(18, 2)
                    .IsRequired();

                entity.Property(e => e.PurchaseDate)
                    .IsRequired();

                entity.Property(e => e.DiscountApplied)
                    .HasPrecision(18, 2)
                    .HasDefaultValue(0);

                entity.Property(e => e.CreatedAt)
                    .HasDefaultValueSql("GETUTCDATE()")
                    .ValueGeneratedOnAdd();

                entity.Property(e => e.UpdatedAt)
                    .HasDefaultValueSql("GETUTCDATE()")
                    .ValueGeneratedOnAddOrUpdate();

                entity.HasIndex(e => e.TicketCode)
                    .IsUnique();

                entity.HasIndex(e => e.Email);

                entity.HasOne(e => e.Currency)
                    .WithMany()
                    .HasForeignKey(e => e.CurrencyId)
                    .OnDelete(DeleteBehavior.Restrict);

                entity.HasOne(e => e.UsedPromoCode)
                    .WithOne(pc => pc.UsedByTicket)
                    .HasForeignKey<Ticket>(e => e.UsedPromoCodeId)
                    .OnDelete(DeleteBehavior.Restrict);

                entity.HasOne(e => e.CreatedPromoCode)
                    .WithOne(pc => pc.CreatedByTicket)
                    .HasForeignKey<PromoCode>(pc => pc.CreatedByTicketId)
                    .OnDelete(DeleteBehavior.Restrict);

                entity.HasMany(e => e.TicketRaceDays)
                    .WithOne(trd => trd.Ticket)
                    .HasForeignKey(trd => trd.TicketId)
                    .OnDelete(DeleteBehavior.Cascade);

                entity.HasIndex(e => e.CurrencyId);
            });

            modelBuilder.Entity<PromoCode>(entity =>
            {
                entity.HasKey(e => e.PromoCodeId);

                entity.Property(e => e.Code)
                    .IsRequired()
                    .HasMaxLength(50);

                entity.Property(e => e.DiscountPercentage)
                    .HasPrecision(18, 2)
                    .IsRequired();

                entity.Property(e => e.ExpiryDate);

                entity.Property(e => e.Status)
                    .IsRequired()
                    .HasConversion<string>();

                entity.Property(e => e.CreatedAt)
                    .HasDefaultValueSql("GETUTCDATE()")
                    .ValueGeneratedOnAdd();

                entity.HasIndex(e => e.Code)
                    .IsUnique();

                entity.HasIndex(e => e.CreatedByTicketId);
                entity.HasIndex(e => e.UsedByTicketId);
            });

            modelBuilder.Entity<TicketRaceDay>(entity =>
            {
                entity.HasKey(e => new { e.TicketId, e.RaceDayId });

                entity.Property(e => e.Price)
                    .HasPrecision(18, 2)
                    .IsRequired();

                entity.Property(e => e.CreatedAt)
                    .HasDefaultValueSql("GETUTCDATE()")
                    .ValueGeneratedOnAdd();

                entity.HasOne(e => e.Ticket)
                    .WithMany(t => t.TicketRaceDays)
                    .HasForeignKey(e => e.TicketId)
                    .OnDelete(DeleteBehavior.Cascade);

                entity.HasOne(e => e.RaceDay)
                    .WithMany(rd => rd.TicketRaceDays)
                    .HasForeignKey(e => e.RaceDayId)
                    .OnDelete(DeleteBehavior.Restrict);

                entity.HasOne(e => e.SeatingZone)
                    .WithMany(sz => sz.TicketRaceDays)
                    .HasForeignKey(e => e.ZoneId)
                    .OnDelete(DeleteBehavior.Restrict);

                entity.HasIndex(e => e.RaceDayId);
                entity.HasIndex(e => e.ZoneId);
            });

            modelBuilder.Entity<Currency>(entity =>
            {
                entity.HasKey(e => e.CurrencyId);

                entity.Property(e => e.Name)
                    .IsRequired()
                    .HasMaxLength(100);

                entity.Property(e => e.Code)
                    .IsRequired()
                    .HasMaxLength(3);

                entity.HasIndex(e => e.Code)
                    .IsUnique();
            });
        }
    }
}
