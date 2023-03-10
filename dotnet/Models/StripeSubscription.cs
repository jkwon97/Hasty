using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sabio.Models.Domain
{
    public class StripeSubscription
    {
        public int SubId { get; set; }
        public int PlanId { get; set; }
        public string PlanName { get; set; }
        public int PlanCost { get; set; }
        public DateTime DateCreated { get; set; }
        public DateTime DateEnd { get; set; }
        public string Status { get; set; }
    }
}
