using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using RookieOnlineAssetManagement.Data;
using RookieOnlineAssetManagement.Entities;
using RookieOnlineAssetManagement.Enums;
using RookieOnlineAssetManagement.Filter;
using RookieOnlineAssetManagement.Helper;
using RookieOnlineAssetManagement.Models;
using RookieOnlineAssetManagement.Responses;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Net;
using System.Security.Claims;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace RookieOnlineAssetManagement.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly ApplicationDbContext _dbContext;

        private readonly UserManager<ApplicationUser> _userManager;

        private readonly RoleManager<ApplicationRole> _roleManager;
        private readonly IConfiguration _configuration;
        public UsersController(ApplicationDbContext dbContext, UserManager<ApplicationUser> userManager, RoleManager<ApplicationRole> roleManager, IConfiguration configuration)
        {
            _dbContext = dbContext;
            _userManager = userManager;
            _roleManager = roleManager;
            _configuration = configuration;
        }

        private string AutoGenerateUserName(string firstName, string lastName)
        {
            string userName = firstName;
            var parts = lastName.Split(" ").ToList();
            var afterName = "";
            foreach (var part in parts)
            {
                afterName = part.Substring(0, 1).ToLower();
            }

            userName += afterName;
            var listUserName = new List<string>();
            var query = _dbContext.Users.Where(x=>x.UserName.StartsWith(userName)).Select(y => y.UserName);
            listUserName.AddRange(query);
            for (int i = 0; i < 1000000; i++)
            {
                userName = firstName;
                userName += afterName;
                if (i > 0)
                {
                    userName = userName + i.ToString();

                }
                var result = listUserName.Find(x => x == userName);
                if (result == null)
                {
                    return userName;
                }

            }
            userName = "";
            return userName;

        }

        private string AutoGenerateStaffCode(int id)
        {
            var code = "SD" + id.ToString("d4");
            return code;
        }

        private string AutoGeneratePassword(string userName, DateTime dob)
        {
            var dateTime = dob.ToString("ddMMyyyy");
            var password = userName + "@" + dateTime;

            // Check if password contains at least one upper character
            if (!Regex.IsMatch(password, "(?=.*[A-Z])"))
            {
                password = char.ToUpper(password[0]) + password.Substring(1);
            }

            return password;
        }

        private Response<UserResponseModel> UserValidation(UserModel model)
        {
            var error = new List<object> { };

            if (model.FirstName == string.Empty)
            {
                error.Add(new { firstName = "The first name is required" });
            }

            if (model.LastName == string.Empty)
            {
                error.Add(new { firstName = "The last name is required" });
            }

            if (DateTime.Now.Year - model.DoB.Year < 18)
            {
                error.Add(new { doB = "User is under 18. Please select a different date" });
            }

            if (model.DoB.Year - model.JoinedDate.Year > 0)
            {
                error.Add(new { joinedDate = "Joined date is not later than Date of Birth. Please select a different date" });
            }
            else if (model.JoinedDate.DayOfWeek == DayOfWeek.Saturday || model.JoinedDate.DayOfWeek == DayOfWeek.Sunday)
            {
                error.Add(new { joinedDate = "Joined date is Saturday or Sunday. Please select a different date" });
            }

            if (model.Roles == string.Empty)
            {
                error.Add(new { RoleType = "The role field is required" });
            }
            else if (model.Roles != RoleName.Admin && model.Roles != RoleName.User)
            {
                error.Add(new { RoleType = "The role is not found" });
            }

            var response = new Response<UserResponseModel>
            {
                Data = null,
                Errors = error
            };

            return response;
        }

        private Response<UserResponseModel> UpdateUserValidation(UpdateUserModel model)
        {
            var error = new List<object> { };

            if (DateTime.Now.Year - model.DoB.Year < 18)
            {
                error.Add(new { doB = "User is under 18. Please select a different date" });
            }

            if (model.DoB.Year - model.JoinedDate.Year > 0)
            {
                error.Add(new { joinedDate = "Joined date is not later than Date of Birth. Please select a different date" });
            }
            else if (model.JoinedDate.DayOfWeek == DayOfWeek.Saturday || model.JoinedDate.DayOfWeek == DayOfWeek.Sunday)
            {
                error.Add(new { joinedDate = "Joined date is Saturday or Sunday. Please select a different date" });
            }

            if (model.RoleType != RoleName.Admin && model.RoleType != RoleName.User)
            {
                error.Add(new { RoleType = "The role is not found" });
            }

            var response = new Response<UserResponseModel>
            {
                Data = null,
                Errors = error
            };

            return response;
        }

        private string GetGender(Gender gender)
        {
            if (gender == Gender.Female)
            {
                return "Female";
            }
            return "Male";
        }
        [Authorize(Roles =RoleName.Admin)]
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var user = await _userManager.Users.Include(u => u.UserRoles).ThenInclude(ur => ur.Role).SingleOrDefaultAsync(u => u.Id == id);

            if (user == null) return NotFound("Cannot find this user!");

            var result = new UserResponseModel
            {
                Id = user.Id,
                StaffCode = user.StaffCode,
                FirstName = user.FirstName,
                LastName = user.LastName,
                Gender = GetGender(user.Gender),
                DoB = user.DoB,
                JoinedDate = user.JoinedDate,
                Location = user.Location,
                UserName = user.UserName,
                Roles = user.UserRoles?.Select(r => r.Role.Name) ?? Enumerable.Empty<string>()
            };

            return Ok(new Response<UserResponseModel>(result));
        }
        [Authorize(Roles = RoleName.Admin)]
        [HttpGet]
        public async Task<IActionResult> GetListUser(string location,string filterUser, [FromQuery] PaginationFilter filter, string keyword, string sortBy, bool asc = true)
        {
            var queryable = !string.IsNullOrEmpty(location)
                ? _userManager.Users.Where(u => u.Location == location)
                : _userManager.Users;

            queryable = queryable.Include(u => u.UserRoles).ThenInclude(ur => ur.Role).Where(u => u.State == UserState.Enable);

            if (!string.IsNullOrEmpty(keyword))
            {
                queryable = queryable.Where(u => u.FirstName.Contains(keyword) || u.LastName.Contains(keyword) || u.StaffCode.Contains(keyword));
            }
            if(!string.IsNullOrEmpty(filterUser))
            {
                queryable = queryable.Where(x => x.UserRoles.FirstOrDefault().Role.Name == filterUser);
            }
            if (sortBy == null)
            {
                queryable = queryable.OrderByDescending(x => x.LastChangeUser);
            }
           
            if (!string.IsNullOrEmpty(sortBy))
            {
                switch (sortBy)
                {
                    case "staffCode":
                        queryable = asc ? queryable.OrderBy(u => u.StaffCode) : queryable.OrderByDescending(u => u.StaffCode);
                        break;
                    case "firstName":
                        queryable = asc ? queryable.OrderBy(u => u.FirstName) : queryable.OrderByDescending(u => u.FirstName);
                        break;
                    case "lastName":
                        queryable = asc ? queryable.OrderBy(u => u.LastName) : queryable.OrderByDescending(u => u.LastName);
                        break;
                    case "joinedDate":
                        queryable = asc ? queryable.OrderBy(u => u.JoinedDate) : queryable.OrderByDescending(u => u.JoinedDate);
                        break;
                    case "roles":
                        queryable = asc
                             ? queryable.OrderBy(user => user.UserRoles.FirstOrDefault().Role.Name)
                             : queryable.OrderByDescending(user => user.UserRoles.FirstOrDefault().Role.Name);
                        break;
                    default:
                        queryable = asc ? queryable.OrderBy(u => u.Id) : queryable.OrderByDescending(u => u.Id);
                        break;
                }
            }

            var count = await queryable.CountAsync();
            var data = await queryable
                .Skip((filter.PageNumber - 1) * filter.PageSize)
                .Take(filter.PageSize)
                .ToListAsync();

           var result = new List<UserResponseModel>();

            foreach (var user in data)
            {
                result.Add(new UserResponseModel
                {
                    Id = user.Id,
                    StaffCode = user.StaffCode,
                    FirstName = user.FirstName,
                    LastName = user.LastName,
                    Gender = GetGender(user.Gender),
                    DoB = user.DoB,
                    JoinedDate = user.JoinedDate,
                    Location = user.Location,
                    UserName = user.UserName,
                    Roles = user.UserRoles?.Select(r => r.Role.Name) ?? Enumerable.Empty<string>()
                });
            }

            var response = PaginationHelper.CreatePagedResponse(result, filter.PageNumber, filter.PageSize, count);
            return Ok(response);
        }
        [Authorize(Roles =RoleName.Admin)]
        [HttpGet("roles")]
        public IActionResult GetRoleList()
        {
            return Ok(_roleManager.Roles);
        }
        [Authorize(Roles = RoleName.Admin)]
        [HttpPost]
        public async Task<IActionResult> CreateUser(UserModel model)
        {
            try
            {
                var userValidation = UserValidation(model);
                if (userValidation.Errors.Count > 0) return BadRequest(userValidation);

                var userName = AutoGenerateUserName(model.FirstName, model.LastName);
                if (userName == null) return BadRequest("Error create UserName .Please try again!");
                var password = AutoGeneratePassword(userName, model.DoB);

                var user = new ApplicationUser
                {
                    FirstName = model.FirstName,
                    LastName = model.LastName,
                    DoB = model.DoB,
                    JoinedDate = model.JoinedDate,
                    Gender = model.Gender,
                    Location = model.Location,
                    UserName = userName,
                    Password = password,
                    State = UserState.Enable,
                    LastChangeUser=DateTime.Now
                };

                var result = await _userManager.CreateAsync(user, password);
                if (result == null) return BadRequest("Something was wrong");
                if (result.Errors.Any()) return BadRequest(result.Errors);

                if (!await _roleManager.RoleExistsAsync(model.Roles))
                {
                    await _roleManager.CreateAsync(new ApplicationRole(model.Roles));
                }
                await _userManager.AddToRoleAsync(user, model.Roles);

                user.StaffCode = AutoGenerateStaffCode(user.Id);
                await _dbContext.SaveChangesAsync();

                return Ok(new UserResponseModel
                {
                    Id = user.Id,
                    FirstName = user.FirstName,
                    LastName = user.LastName,
                    DoB = user.DoB,
                    Gender = GetGender(user.Gender),
                    Location = user.Location,
                    StaffCode = user.StaffCode,
                    JoinedDate = user.JoinedDate,
                    UserName = user.UserName,
                    Password = user.Password,
                    Roles = await _userManager.GetRolesAsync(user)
                });
            }
            catch (Exception ex)
            {
                return StatusCode((int)HttpStatusCode.InternalServerError, ex);
            }
        }
        [Authorize]
        [HttpPut("{id}")]
        public async Task<IActionResult> EditUser(int id, UpdateUserModel model)
        {
            try
            {
                var user = await _userManager.Users.Include(u => u.UserRoles).ThenInclude(ur => ur.Role).SingleOrDefaultAsync(u => u.Id == id && u.State == UserState.Enable);

                if (user == null) return NotFound("Cannot find this user!");

                var userValidation = UpdateUserValidation(model);
                if (userValidation.Errors.Count > 0) return BadRequest(userValidation);

                var oldUserRole = await _userManager.GetRolesAsync(user);
                if (oldUserRole.FirstOrDefault() != model.RoleType)
                {
                    await _userManager.RemoveFromRolesAsync(user, oldUserRole);

                    if (!await _roleManager.RoleExistsAsync(model.RoleType))
                    {
                        await _roleManager.CreateAsync(new ApplicationRole(model.RoleType));
                    }

                    await _userManager.AddToRoleAsync(user, model.RoleType);
                }

                user.DoB = model.DoB;
                user.JoinedDate = model.JoinedDate;
                user.Gender = model.Gender;
                user.LastChangeUser = DateTime.Now;
                await _dbContext.SaveChangesAsync();

                return Ok(new UserResponseModel
                {
                    Id = user.Id,
                    FirstName = user.FirstName,
                    LastName = user.LastName,
                    Password = user.Password,
                    DoB = user.DoB,
                    Gender = GetGender(user.Gender),
                    Location = user.Location,
                    StaffCode = user.StaffCode,
                    JoinedDate = user.JoinedDate,
                    UserName = user.UserName,
                    Roles = user.UserRoles?.Select(r => r.Role.Name) ?? Enumerable.Empty<string>()
                });
            }
            catch (Exception ex)
            {
                return StatusCode((int)HttpStatusCode.InternalServerError, ex);
            }

        }
        [Authorize(Roles =RoleName.Admin)]
        [HttpPut("disable/{id}")]
        public async Task<IActionResult> DisableUser(int id)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier).Value;
            if (userId == id.ToString())
            {
                return BadRequest("You can't disable yourself");
            }
            var user = await _dbContext.Users.Include(u => u.AssignmentsTo).SingleOrDefaultAsync(u => u.Id == id);
            var errors = new List<object>();

            if (user == null)
            {
                errors.Add(new
                {
                    message = "The user is not exist"
                });

                return BadRequest(new Response<UserResponseModel> { Errors = errors });
            }


            if (user.AssignmentsTo.Count > 0)
            {
                errors.Add(new
                {
                    message = "There are valid assignments belonging to this user. Please close all assignments before disabling user."
                });

                return BadRequest(new Response<UserResponseModel> { Errors = errors });
            }

            user.State = UserState.Disable;
            await _dbContext.SaveChangesAsync();
            return Ok();
        }
        [HttpPost]
        [Route("login")]
        public async Task<IActionResult> Login(LoginModel model)
        {
            var user = await _userManager.FindByNameAsync(model.Username);
            if (user != null && await _userManager.CheckPasswordAsync(user, model.Password))
            {
                if (user.State == UserState.Disable) return BadRequest("User is disable!");
                var userRoles = await _userManager.GetRolesAsync(user);
                var authClaims = new List<Claim>
                {
                    new Claim(ClaimTypes.Name,user.UserName),
                    new Claim(ClaimTypes.NameIdentifier,user.Id.ToString())
                };
                foreach (var userRole in userRoles)
                {
                    authClaims.Add(new Claim(ClaimTypes.Role, userRole));
                }
                var authSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["JWT:Secret"]));
                var token = new JwtSecurityToken(
                    issuer: _configuration["JWT:ValidIssuer"],
                    audience: _configuration["JWT:ValidAudience"],
                    expires: DateTime.Now.AddHours(20),
                    claims: authClaims,
                    signingCredentials: new SigningCredentials(authSigningKey, SecurityAlgorithms.HmacSha256)
                    );
                user.CountLogin = user.CountLogin + 1;
                await _userManager.UpdateAsync(user);
                return Ok(new
                {
                    token = new JwtSecurityTokenHandler().WriteToken(token),
                    expiration = token.ValidTo,
                    role = userRoles[0],
                    userId = user.Id,
                    userName=user.UserName,
                    location = user.Location,
                    countLogin=user.CountLogin
                });

            }
            return Unauthorized("Username or password is incorrect. Please try again");
        }
        [Authorize]
        [HttpPut("ChangPasswordFirstLogin")]
        public async Task<IActionResult> ChangePasswordFirstLogin(int userId,string newPassword)
        {
            try
            {
                var user = await _userManager.FindByIdAsync(userId.ToString());
                if (user == null)
                {
                    return NotFound("Not Found User!");
                }
                var tokenChangePassword = await _userManager.GeneratePasswordResetTokenAsync(user);
                var resetPassword = await _userManager.ResetPasswordAsync(user, tokenChangePassword, newPassword);
                if (!resetPassword.Succeeded)
                {
                    return StatusCode(StatusCodes.Status500InternalServerError, "Password must have 8 characters and include 1 uppercase character, 1 special character and 1 number ");
                }

                return Ok("Your password has been changed successfully");
            }
            catch (Exception ex)
            {

                return StatusCode((int)HttpStatusCode.InternalServerError, ex);
            }
        }
        [Authorize]
        [HttpPut("ChangPassword")]
        public async Task<IActionResult> ChangPassword(string userId,string oldPassword,string newPassword)
        {
            try
            {
                var user = await _userManager.FindByIdAsync(userId.ToString());
                if (user == null)
                {
                    return NotFound("Not Found User!");
                }
                if (!await _userManager.CheckPasswordAsync(user, oldPassword))
                {
                    return BadRequest("Password is incorrect");
                }
                var changePassword = await _userManager.ChangePasswordAsync(user, oldPassword, newPassword);
                if (!changePassword.Succeeded)
                {
                    return StatusCode(StatusCodes.Status500InternalServerError, "Password must have 8 characters and include 1 uppercase character, 1 special character and 1 number ");
                }
                return Ok("Your password has been changed successfully");
            }
            catch (Exception ex)
            {

                return StatusCode((int)HttpStatusCode.InternalServerError, ex);
            }
        }


    }
}
