using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace f1_portal_api.Domain
{
    public class TicketsByPurchaseDate
    {
        public long Id { get; set; }
        public string PurchaseDate { get; set; } = string.Empty;
        public long TicketCount { get; set; }
    }
}
