using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace RookieOnlineAssetManagement.Models
{
    public class AssignmentModel
    {
        public int AssignToId { get; set; }
        public int AssignById { get; set; }
        public int AssetId { get; set; }
        public DateTime AssignedDate { get; set; }
        public string Note { get; set; }
    }
}
