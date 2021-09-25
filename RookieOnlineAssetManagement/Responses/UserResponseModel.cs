using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace RookieOnlineAssetManagement.Responses
{
    public class UserResponseModel
    {
        public int Id { get; set; }
        public string StaffCode { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string UserName { get; set; }
        public string Password { get; set; }
        public DateTime DoB { get; set; }
        public DateTime JoinedDate { get; set; }
        public string Gender { get; set; }
        public string Location { get; set; }
        public IEnumerable<string> Roles { get; set; }
    }
}
