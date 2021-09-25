using RookieOnlineAssetManagement.Enums;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace RookieOnlineAssetManagement.Models
{
    public class ReturnModel
    {
        [Required]
        public int RequestedByUserId { get; set; }
        [Required]
        public int AssignmentId { get; set; }
    }
}
