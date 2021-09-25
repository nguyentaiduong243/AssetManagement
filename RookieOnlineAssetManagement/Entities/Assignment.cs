using RookieOnlineAssetManagement.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace RookieOnlineAssetManagement.Entities
{
    public class Assignment
    {
        public int Id { get; set; }
        public DateTime AssignedDate { get; set; }
        public AssignmentState State { get; set; }
        public string Note { get; set; }

        public int AssetId { get; set; }
        public virtual Asset Asset { get; set; }
        public DateTime LastChangeAssignment { get; set; }
        public int AssignById { get; set; }
        public virtual ApplicationUser AssignBy { get; set; }
        
        public int AssignToId { get; set; }
        public virtual ApplicationUser AssignTo { get; set; }

        public virtual ReturnRequest ReturnRequest { get; set; }
    }
}
