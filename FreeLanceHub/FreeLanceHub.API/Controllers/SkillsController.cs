using FreeLanceHub.Core.DTOs.Catalog;
using FreeLanceHub.Infrastructure.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace FreeLanceHub.API.Controllers;

/// <summary>
/// Контроллер для получения списка навыков.
/// Используется в формах создания услуг, заказов и редактирования профиля.
/// </summary>
[ApiController]
[Route("api/[controller]")]
public class SkillsController : ControllerBase
{
    private readonly ApplicationDbContext _db;

    public SkillsController(ApplicationDbContext db)
    {
        _db = db;
    }

    /// <summary>
    /// GET /api/skills
    /// Все навыки — для мультиселекта на фронтенде.
    /// </summary>
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var skills = await _db.Skills
            .OrderBy(s => s.Name)
            .Select(s => new SkillResponseDto
            {
                Id = s.Id,
                Name = s.Name
            })
            .ToListAsync();

        return Ok(skills);
    }
}