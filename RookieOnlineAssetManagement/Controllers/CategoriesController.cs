using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RookieOnlineAssetManagement.Data;
using RookieOnlineAssetManagement.Entities;
using RookieOnlineAssetManagement.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace RookieOnlineAssetManagement.Controllers
{
    [Authorize(Roles =RoleName.Admin)]
    [ApiController]
    [Route("api/[Controller]")]
    public class CategoriesController : ControllerBase

    {
        private readonly ApplicationDbContext _context;
        public CategoriesController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public IEnumerable<Category> GetAllCategory()
        {
            return _context.Categories.OrderBy(x => x.Name).ToList();
        }
        [HttpPost]
        public async Task<IActionResult> CreateCategory(CategoryModel category)
        {
            var catename = _context.Categories.SingleOrDefault(x => x.Name == category.Name);
            if (catename != null)
            {
                return BadRequest("Category name exist!");
            }
            var catecode = _context.Categories.SingleOrDefault(x => x.CategoryCode == category.CategoryCode);
            if (catecode != null)
            {
                return BadRequest("Category code exist!");
            }
            var newcategory = new Category
            {
                CategoryCode = category.CategoryCode,
                Name = category.Name
            };
            await _context.Categories.AddAsync(newcategory);
            await _context.SaveChangesAsync();
            return Ok(newcategory);
        }
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateCategory(int id, Category category)
        {
            if (id != category.Id)
            {
                return BadRequest();
            }
            var catename = _context.Categories.SingleOrDefault(x => x.Name == category.Name);
            if (catename != null)
            {
                return BadRequest("Category name exist!");
            }
            var catecode = _context.Categories.SingleOrDefault(x => x.CategoryCode == category.CategoryCode);
            if (catecode != null)
            {
                return BadRequest("Category code exist!");
            }
            _context.Entry(category).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            return Ok(category);

        }
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCategory(int id)
        {
            var cate = _context.Categories.SingleOrDefault(x => x.Id == id);
            if(cate == null)
            {
                return NotFound();
            }
            _context.Categories.Remove(cate);
            await _context.SaveChangesAsync();
            return Ok("Succeed!");
        }
    }
}
