using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace f1_booking_tickets.Domain.Entities
{
    public class SeatingZone
    {
        public int ZoneId { get; set; }
        public int RaceId { get; set; }
        public string Name { get; set; } = string.Empty;
        public int Capacity { get; set; }
        public decimal PriceMultiplier { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
        public Race Race { get; set; } = null!;
        public ICollection<TicketRaceDay> TicketRaceDays { get; set; } = new List<TicketRaceDay>();
    }
}
