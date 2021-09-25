using RookieOnlineAssetManagement.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace RookieOnlineAssetManagement.Models
{
    public class UpdateUserModel
    {
        public DateTime DoB { get; set; }
        public Gender Gender { get; set; }
        public DateTime JoinedDate { get; set; }
        public string RoleType { get; set; }
    }
}
