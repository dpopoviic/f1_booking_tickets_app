using f1_portal_api.Domain;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace f1_portal_api.DataAccess
{
    public class Context : DbContext
    {
        public Context(DbContextOptions<Context> options) : base(options)
        {
        }

        public DbSet<TicketsByRaceDay> TicketsByRaceDay { get; set; }
        public DbSet<TicketsByPurchaseDate> TicketsByPurchaseDate { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<TicketsByRaceDay>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.HasIndex(e => e.RaceDayId).IsUnique();
            });

            modelBuilder.Entity<TicketsByPurchaseDate>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.HasIndex(e => e.PurchaseDate).IsUnique();
            });
        }
    }
}
