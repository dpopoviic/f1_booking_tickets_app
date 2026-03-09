using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace f1_booking_tickets.Domain.Entities
{
    public class RaceDay
    {
        public int RaceDayId { get; set; }
        public int RaceId { get; set; }
        public DateTime Date { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public decimal DayPrice { get; set; }
        public int Capacity { get; set; }
        public int SoldTickets { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
        public Race Race { get; set; } = null!;
        public ICollection<TicketRaceDay> TicketRaceDays { get; set; } = new List<TicketRaceDay>();
    }
}
