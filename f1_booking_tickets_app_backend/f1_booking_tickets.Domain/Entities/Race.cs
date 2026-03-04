using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace f1_booking_tickets.Domain.Entities
{
    public class Race
    {
        public int RaceId { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Location { get; set; } = string.Empty;
        public decimal BasePrice { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
        public ICollection<RaceDay> RaceDays { get; set; } = new List<RaceDay>();
        public ICollection<SeatingZone> SeatingZones { get; set; } = new List<SeatingZone>();
    }
}
