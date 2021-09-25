using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RookieOnlineAssetManagement.Data;
using RookieOnlineAssetManagement.Entities;
using RookieOnlineAssetManagement.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Threading.Tasks;

namespace RookieOnlineAssetManagement.Controllers
{
    [Authorize(Roles=RoleName.Admin)]
    [ApiController]
    [Route("api/[Controller]")]
    public class ReportsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        public ReportsController(ApplicationDbContext context)
        {
            _context = context;
        }
        [HttpGet]
        public IActionResult ReportList(string sortBy, bool asc = true)
        {
            try
            {
                var query = from c in _context.Categories.Include(c => c.Assets)
                            select new
                            {
                                CategoryName = c.Name,
                                Total = c.Assets.Count,
                                Assgined = c.Assets.Count(a => a.State == AssetState.Assigned),
                                Available = c.Assets.Count(a => a.State == AssetState.Available),
                                NotAvailable = c.Assets.Count(a => a.State == AssetState.NotAvailable),
                                WaitingForRecycling = c.Assets.Count(a => a.State == AssetState.WaitingForRecycling),
                                WaitingForApproval = c.Assets.Count(a => a.State == AssetState.WaitingForApproval),
                                Recycled = c.Assets.Count(a => a.State == AssetState.Recycled),
                            };
                if (!string.IsNullOrEmpty(sortBy))
                {
                    switch (sortBy)
                    {
                        
                        case "category":
                            query = asc ? query.OrderBy(u => u.CategoryName) : query.OrderByDescending(u => u.CategoryName);

                            break;
                        case "total":
                            query = asc ? query.OrderBy(u => u.Total) : query.OrderByDescending(u => u.Total);

                            break;
                        case "assigned":
                            query = asc ? query.OrderBy(u => u.Assgined) : query.OrderByDescending(u => u.Assgined);

                            break;
                        case "available":
                            query = asc ? query.OrderBy(u => u.Available) : query.OrderByDescending(u => u.Available);

                            break;
                        case "notAvailable":
                            query = asc ? query.OrderBy(u => u.NotAvailable) : query.OrderByDescending(u => u.NotAvailable);

                            break;
                        case "waitingForRecycling":
                            query = asc ? query.OrderBy(u => u.WaitingForRecycling) : query.OrderByDescending(u => u.WaitingForRecycling);

                            break;
                        case "recycled":
                            query = asc ? query.OrderBy(u => u.Recycled) : query.OrderByDescending(u => u.Recycled);

                            break;
                        case "waitingForApproval":
                            query = asc ? query.OrderBy(u => u.WaitingForApproval) : query.OrderByDescending(u => u.WaitingForApproval);

                            break;
                        default:
                            query = asc ? query.OrderBy(u => u.CategoryName) : query.OrderByDescending(u => u.CategoryName);

                            break;

                    }
                }
                return Ok(query);
            }
            catch (Exception ex)
            {
                return StatusCode((int)HttpStatusCode.InternalServerError, ex);
            }     

        }
        //[HttpGet("duyet")]
        //public IActionResult Get(string location)
        //{
        //    var query = from a in _context.Assets
        //                join b in _context.Categories
        //                on a.CategoryId equals b.Id
        //                where a.Location == location
        //                group  a by b.Name into gr
        //                select new
        //                {
        //                    Cate = gr.Key,
        //                    Total = gr.Count(),
        //                    Assigned = gr.Count(u => u.State == AssetState.Assigned),
        //                    NotAvailable = gr.Count(u => u.State == AssetState.NotAvailable),
        //                    Available = gr.Count(u => u.State == AssetState.Available),
        //                    WaitingForRecycling = gr.Count(u => u.State == AssetState.WaitingForRecycling),
        //                    WaitingForApproval = gr.Count(u => u.State == AssetState.WaitingForApproval)
        //                };
        //    return Ok(query);
        //}
    }
}
