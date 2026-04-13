using FreeLanceHub.Core.DTOs.Catalog;
using FreeLanceHub.Infrastructure.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace FreeLanceHub.API.Controllers;

/// <summary>
/// Контроллер для получения списка категорий.
/// Используется в формах создания услуг и заказов.
/// Полностью публичный.
/// </summary>
[ApiController]
[Route("api/[controller]")]
public class CategoriesController : ControllerBase
{
    private readonly ApplicationDbContext _db;

    public CategoriesController(ApplicationDbContext db)
    {
        _db = db;
    }

    /// <summary>
    /// GET /api/categories
    /// Все категории — для дропдаунов на фронтенде.
    /// </summary>
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var categories = await _db.Categories
            .OrderBy(c => c.Name)
            .Select(c => new CategoryDto
            {
                Id = c.Id,
                Name = c.Name,
                Description = c.Description,
                IconUrl = c.IconUrl
            })
            .ToListAsync();

        return Ok(categories);
    }
}