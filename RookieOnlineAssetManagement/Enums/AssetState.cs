using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace RookieOnlineAssetManagement.Enums
{
    public enum AssetState
    {
        Available,
        WaitingForApproval,
        NotAvailable,
        Assigned,
        WaitingForRecycling,
        Recycled
    }
}
