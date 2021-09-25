using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace RookieOnlineAssetManagement.Responses
{
    public class AssignmentResponseModel
    {
        public int Id { get; set; }
        public int AssetId { get; set; }
        public string AssetCode { get; set; }
        public string AssetName { get; set; }
        public int AssignToId { get; set; }
        public string AssignTo { get; set; }
        public int AssignById { get; set; }
        public string AssignBy { get; set; }
        public DateTime AssignDate { get; set; }
        public string Note { get; set; }
        public string State { get; set; }
    }
}
