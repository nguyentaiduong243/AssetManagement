using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace RookieOnlineAssetManagement.Responses
{
    public class Response<T>
    {
        public Response()
        {
        }
        public Response(T data)
        {
            Errors = null;
            Data = data;
        }
        public T Data { get; set; }
        public List<object> Errors { get; set; }
    }
}
