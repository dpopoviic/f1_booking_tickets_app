using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Sockets;
using System.Text;
using System.Threading.Tasks;

namespace f1_booking_tickets.Domain.Entities
{
    public class TicketRaceDay
    {
        public int TicketId { get; set; }
        public int RaceDayId { get; set; }
        public int ZoneId { get; set; }
        public decimal Price { get; set; }
        public DateTime CreatedAt { get; set; }
        public Ticket Ticket { get; set; } = null!;
        public RaceDay RaceDay { get; set; } = null!;
        public SeatingZone SeatingZone { get; set; } = null!;
    }
}
