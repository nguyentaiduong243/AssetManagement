using RookieOnlineAssetManagement.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace RookieOnlineAssetManagement.Models
{
    public class AssetModel
    {
        public string AssetName { get; set; }
        public string Specification { get; set; }
        public DateTime InstalledDate { get; set; }
        public AssetState State { get; set; }
        public string Location { get; set; }

        public int CategoryId { get; set; }
    }
}
 