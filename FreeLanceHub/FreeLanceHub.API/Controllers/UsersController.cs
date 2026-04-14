using FreeLanceHub.Core.DTOs.Users;
using FreeLanceHub.Core.Entities;
using FreeLanceHub.Infrastructure.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace FreeLanceHub.API.Controllers;

/// <summary>
/// Контроллер профилей пользователей.
/// GET /api/users/{id}  — публичный профиль
/// GET /api/users/me    — мой расширенный профиль (авторизован)
/// PUT /api/users/me    — обновить свой профиль (авторизован)
/// </summary>
[ApiController]
[Route("api/[controller]")]
public class UsersController : ControllerBase
{
    private readonly ApplicationDbContext _db;
    private readonly UserManager<ApplicationUser> _userManager;

    public UsersController(
        ApplicationDbContext db,
        UserManager<ApplicationUser> userManager)
    {
        _db = db;
        _userManager = userManager;
    }

    // ─────────────────────────────────────────────────────────────
    /// <summary>
    /// GET /api/users/me
    /// Мой расширенный профиль с навыками.
    /// ВАЖНО: этот роут должен быть ДО {id} чтобы "me" не
    /// интерпретировалось как id.
    /// </summary>
    [HttpGet("me")]
    [Authorize]
    public async Task<IActionResult> GetMe()
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)!;

        var user = await _db.Users
            .Include(u => u.UserSkills).ThenInclude(us => us.Skill)
            .FirstOrDefaultAsync(u => u.Id == userId);

        if (user == null) return NotFound();

        var roles = await _userManager.GetRolesAsync(user);

        return Ok(new MeDto
        {
            Id = user.Id,
            Email = user.Email!,
            FirstName = user.FirstName,
            LastName = user.LastName,
            University = user.University,
            Specialty = user.Specialty,
            Bio = user.Bio,
            AvatarUrl = user.AvatarUrl,
            Rating = user.Rating,
            ReviewCount = user.ReviewCount,
            Role = roles.FirstOrDefault() ?? "Student",
            Skills = user.UserSkills
                .Select(us => new UserSkillDto { Id = us.SkillId, Name = us.Skill.Name })
                .ToList()
        });
    }

    // ─────────────────────────────────────────────────────────────
    /// <summary>
    /// GET /api/users/{id}
    /// Публичный профиль любого пользователя.
    /// </summary>
    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(string id)
    {
        var user = await _db.Users
            .Include(u => u.UserSkills).ThenInclude(us => us.Skill)
            .FirstOrDefaultAsync(u => u.Id == id);

        if (user == null)
            return NotFound(new { message = "Пользователь не найден" });

        var roles = await _userManager.GetRolesAsync(user);

        return Ok(new UserProfileDto
        {
            Id = user.Id,
            Email = user.Email!,
            FirstName = user.FirstName,
            LastName = user.LastName,
            University = user.University,
            Specialty = user.Specialty,
            Bio = user.Bio,
            AvatarUrl = user.AvatarUrl,
            Rating = user.Rating,
            ReviewCount = user.ReviewCount,
            IsBlocked = user.IsBlocked,
            CreatedAt = user.CreatedAt,
            Role = roles.FirstOrDefault() ?? "Student",
            Skills = user.UserSkills
                .Select(us => new UserSkillDto { Id = us.SkillId, Name = us.Skill.Name })
                .ToList()
        });
    }

    // ─────────────────────────────────────────────────────────────
    /// <summary>
    /// PUT /api/users/me
    /// Обновить свой профиль: имя, bio, аватар, навыки.
    /// </summary>
    [HttpPut("me")]
    [Authorize]
    public async Task<IActionResult> UpdateMe([FromBody] UpdateProfileDto dto)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);

        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)!;

        var user = await _db.Users
            .Include(u => u.UserSkills)
            .FirstOrDefaultAsync(u => u.Id == userId);

        if (user == null) return NotFound();

        // Обновляем поля
        user.FirstName = dto.FirstName;
        user.LastName = dto.LastName;
        user.University = dto.University;
        user.Specialty = dto.Specialty;
        user.Bio = dto.Bio;
        user.AvatarUrl = dto.AvatarUrl;

        // Обновляем навыки: полная замена
        _db.UserSkills.RemoveRange(user.UserSkills);

        if (dto.SkillIds != null && dto.SkillIds.Count > 0)
        {
            foreach (var skillId in dto.SkillIds.Distinct())
            {
                var skillExists = await _db.Skills.AnyAsync(s => s.Id == skillId);
                if (skillExists)
                {
                    _db.UserSkills.Add(new UserSkill
                    {
                        UserId = userId,
                        SkillId = skillId
                    });
                }
            }
        }

        await _db.SaveChangesAsync();

        return Ok(new { message = "Профиль успешно обновлён" });
    }
}