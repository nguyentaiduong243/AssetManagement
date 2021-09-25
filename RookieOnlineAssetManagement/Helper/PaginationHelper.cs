using RookieOnlineAssetManagement.Responses;
using System;
using System.Collections.Generic;

namespace RookieOnlineAssetManagement.Helper
{
    public class PaginationHelper
    {
        public static PagedResponse<List<T>> CreatePagedResponse<T>(List<T> data, int pageIndex, int pageSize, int totalRecords)
        {
            var response = new PagedResponse<List<T>>(data, pageIndex, pageSize);

            var totalPages = (double)totalRecords / pageSize;
            var roundedTotalPages = Convert.ToInt32(Math.Ceiling(totalPages));

            response.TotalPages = roundedTotalPages;
            response.TotalRecords = totalRecords;

            return response;
        }
    }
}
