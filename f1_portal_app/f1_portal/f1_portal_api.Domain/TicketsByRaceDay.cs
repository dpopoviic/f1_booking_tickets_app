using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace f1_portal_api.Domain
{
    public class TicketsByRaceDay
    {
        public long Id { get; set; }
        public long RaceDayId { get; set; }
        public string RaceDayName { get; set; } = string.Empty;
        public string RaceDayDate { get; set; } = string.Empty;
        public long TicketCount { get; set; }
    }
}
