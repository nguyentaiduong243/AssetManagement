using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using RookieOnlineAssetManagement.Data;
using RookieOnlineAssetManagement.Entities;
using RookieOnlineAssetManagement.Enums;
using RookieOnlineAssetManagement.Filter;
using RookieOnlineAssetManagement.Helper;
using RookieOnlineAssetManagement.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Threading.Tasks;

namespace RookieOnlineAssetManagement.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[Controller]")]
    public class ReturnsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        public ReturnsController(ApplicationDbContext context)
        {
            _context = context;
        }
        [Authorize(Roles =RoleName.Admin)]
        [HttpGet]
        public IActionResult GetListReturnRequest(int? state, string returnedDate, [FromQuery] PaginationFilter filter, string keyword, string sortBy, bool asc = true)
        {
            var queryable = from a in _context.Assets
                            join b in _context.Assignments
                            on a.Id equals b.AssetId
                            join c in _context.ReturnRequests
                            on b.Id equals c.AssignmentId
                            join d in _context.Users
                            on c.RequestedByUserId equals d.Id
                            join f in _context.Users
                            on c.AcceptedByUserId equals f.Id
                            into g
                            from f in g.DefaultIfEmpty()
                            select new
                            {
                                ReturnId=c.Id,
                                AssetCode=a.AssetCode,
                                AssetName=a.AssetName,
                                RequestBy=d.UserName,
                                AssignedDate=b.AssignedDate,
                                AcceptedBy = f.UserName,
                                ReturnedDate = c.ReturnedDate,
                                State=c.State
                                
                            };
            if (!string.IsNullOrEmpty(keyword))
            {
                queryable = queryable.Where(u => u.AssetName.Contains(keyword) || u.AssetCode.Contains(keyword)||u.RequestBy.Contains(keyword));
            }
            if (state !=null &&!string.IsNullOrEmpty(state.ToString()))
            {
                queryable = queryable.Where(x => x.State == (ReturnRequestState)state);
            }
            if (!string.IsNullOrEmpty(returnedDate))
            {
                DateTime date;
                if (DateTime.TryParseExact(returnedDate, "dd/MM/yyyy",
                System.Globalization.CultureInfo.InvariantCulture,
                System.Globalization.DateTimeStyles.None, out date))
                {
                    queryable = queryable.Where(a => a.ReturnedDate != null && a.ReturnedDate.Value.Date == date.Date);
                }
               
            }

            if (!string.IsNullOrEmpty(sortBy))
            {
                switch (sortBy)
                {
                    case "assetCode":
                        queryable = asc ? queryable.OrderBy(u => u.AssetCode) : queryable.OrderByDescending(u => u.AssetCode);
                        break;
                    case "assetName":
                        queryable = asc ? queryable.OrderBy(u => u.AssetName) : queryable.OrderByDescending(u => u.AssetName);

                        break;
                    case "requestedBy":
                        queryable = asc ? queryable.OrderBy(u => u.RequestBy) : queryable.OrderByDescending(u => u.RequestBy);

                        break;
                    case "assignedDate":
                        queryable = asc ? queryable.OrderBy(u => u.AssignedDate) : queryable.OrderByDescending(u => u.AssignedDate);

                        break;
                    case "acceptedBy":
                        queryable = asc ? queryable.OrderBy(u => u.AcceptedBy) : queryable.OrderByDescending(u => u.AcceptedBy);

                        break;
                    case "returnedDate":
                        queryable = asc ? queryable.OrderBy(u => u.ReturnedDate) : queryable.OrderByDescending(u => u.ReturnedDate);

                        break;
                    case "state":
                        queryable = asc ? queryable.OrderBy(u => u.State) : queryable.OrderByDescending(u => u.State);

                        break;
                    default:
                        queryable = asc ? queryable.OrderBy(u => u.ReturnId) : queryable.OrderByDescending(u => u.ReturnId);

                        break;

                }
            }
            var count = queryable.Count();
            var data = queryable.Skip((filter.PageNumber - 1) * filter.PageSize)
                .Take(filter.PageSize).ToList();
            var response = PaginationHelper.CreatePagedResponse(data, filter.PageNumber, filter.PageSize, count);
            return Ok(response);
        }
        [HttpPost]
        public async Task<IActionResult> CreateReturn(ReturnModel returnModel)
        {
            try
            {
                if (string.IsNullOrEmpty((returnModel.RequestedByUserId).ToString()))
                {
                    return BadRequest("RequestByUserId is required!");
                }
                if (string.IsNullOrEmpty((returnModel.AssignmentId).ToString()))
                {
                    return BadRequest("AssignmentId is required!");
                }
                var assignment = _context.Assignments.SingleOrDefault(x => x.Id == returnModel.AssignmentId);
                if (assignment.State != AssignmentState.Accepted) return BadRequest("Assigment must have state accepted!");
                var newReturn = new ReturnRequest
                {
                    State = ReturnRequestState.WaitingForReturning,
                    RequestedByUserId = returnModel.RequestedByUserId,
                    AssignmentId = returnModel.AssignmentId

                };
                await _context.ReturnRequests.AddAsync(newReturn);
                assignment.State = AssignmentState.WaitingForReturning;
                await _context.SaveChangesAsync();
                return Ok(newReturn);
            }
            catch (Exception ex)
            {
                return StatusCode((int)HttpStatusCode.InternalServerError, ex);
            }
        }
       [Authorize(Roles =RoleName.Admin)]
       [HttpPut("{id}/Completed")]
       public async Task<IActionResult> CompletedReturnRequest(int id,int acceptedByUserId)
        {

            try
            {
                var request = await _context.ReturnRequests.FindAsync(id);
                if (request == null) return NotFound("Not Found!");
                if (request.State != ReturnRequestState.WaitingForReturning) return BadRequest("Request must have state waiting for returning ");
                request.State = ReturnRequestState.Completed;
                request.ReturnedDate = DateTime.Now;
                request.AcceptedByUserId = acceptedByUserId;
                var assignment = _context.Assignments.SingleOrDefault(x => x.Id == request.AssignmentId);
                if (assignment == null)
                {
                    return NotFound("Not found assignment with assignmentId in return asset! ");
                }
                assignment.State = AssignmentState.Returned;
                var asset = _context.Assets.SingleOrDefault(x => x.Id == assignment.AssetId);
                if (asset == null)
                {
                    return NotFound("Not found asset with assignment in return asset!");
                }
                asset.State = AssetState.Available;
                await _context.SaveChangesAsync();
                return Ok(request);
            }
            catch (Exception ex)
            {
                return StatusCode((int)HttpStatusCode.InternalServerError, ex);
            }
        }
        [Authorize(Roles=RoleName.Admin)]
        [HttpPut("{id}/Declined")]
        public async Task<IActionResult> DeclinedReturnRequest(int id, int acceptedByUserId)
        {
            try
            {
                var request = await _context.ReturnRequests.FindAsync(id);
                if (request == null) return NotFound("Not Found!");
                if (request.State != ReturnRequestState.WaitingForReturning) return BadRequest("Request must have state waiting for returning ");
                request.State = ReturnRequestState.Declined;
                request.ReturnedDate = DateTime.Now;
                request.AcceptedByUserId = acceptedByUserId;
                var assignment = _context.Assignments.SingleOrDefault(x => x.Id == request.AssignmentId);
                if (assignment == null)
                {
                    return NotFound("Not found assignment with assignmentId in return asset! ");
                }
                assignment.State = AssignmentState.Accepted;
                _context.ReturnRequests.Remove(request);
                await _context.SaveChangesAsync();
                return Ok(request);
            }
            catch (Exception ex)
            {
                return StatusCode((int)HttpStatusCode.InternalServerError, ex);
            }
            
        }
        
    }
}
