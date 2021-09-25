using RookieOnlineAssetManagement.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace RookieOnlineAssetManagement.Entities
{
    public class ReturnRequest
    {
        public int Id { get; set; }
        
        public DateTime? ReturnedDate { get; set; }
        public ReturnRequestState State { get; set; }
        
        public int RequestedByUserId { get; set; }
        public int? AcceptedByUserId { get; set; }
        public virtual ApplicationUser RequestedUser { get; set; }
        public virtual ApplicationUser AcceptedUser { get; set; }
        public int AssignmentId { get; set; }
        public virtual Assignment Assignment { get; set; }
    }
}
