using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace RookieOnlineAssetManagement.Entities
{
    public class Category
    {
        public int Id { get; set; }
        public string CategoryCode { get; set; }
        public string Name { get; set; }

        public ICollection<Asset> Assets { get; set; }
    }
}
