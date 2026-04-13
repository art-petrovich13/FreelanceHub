using FreeLanceHub.Core.DTOs.Gigs;
using FreeLanceHub.Core.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace FreeLanceHub.API.Controllers;

/// <summary>
/// Контроллер для работы с услугами (Gigs).
/// GET — публичные (без авторизации).
/// POST/PUT/DELETE — только авторизованным пользователям.
/// </summary>
[ApiController]
[Route("api/[controller]")]  // → api/gigs
public class GigsController : ControllerBase
{
    private readonly IGigService _gigService;

    public GigsController(IGigService gigService)
    {
        _gigService = gigService;
    }

    /// <summary>
    /// GET /api/gigs
    /// Список активных услуг с пагинацией и фильтрами.
    /// Публичный — авторизация не требуется.
    /// </summary>
    [HttpGet]
    public async Task<IActionResult> GetAll(
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 12,
        [FromQuery] Guid? categoryId = null,
        [FromQuery] string? search = null,
        [FromQuery] string? sortBy = null)
    {
        if (pageSize > 50) pageSize = 50;
        if (page < 1) page = 1;

        var result = await _gigService.GetGigsAsync(page, pageSize, categoryId, search, sortBy);
        return Ok(result);
    }

    /// <summary>
    /// GET /api/gigs/{id}
    /// Полная информация об услуге.
    /// Публичный.
    /// </summary>
    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetById(Guid id)
    {
        var gig = await _gigService.GetByIdAsync(id);
        return gig == null ? NotFound(new { message = "Услуга не найдена" }) : Ok(gig);
    }

    /// <summary>
    /// GET /api/gigs/my
    /// Мои услуги (все статусы: Pending, Active, Rejected, Archived).
    /// Требует авторизации.
    /// </summary>
    [HttpGet("my")]
    [Authorize]
    public async Task<IActionResult> GetMy()
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)!;
        var gigs = await _gigService.GetByStudentIdAsync(userId);
        return Ok(gigs);
    }

    /// <summary>
    /// GET /api/gigs/student/{studentId}
    /// Публичные активные услуги конкретного студента (для его профиля).
    /// </summary>
    [HttpGet("student/{studentId}")]
    public async Task<IActionResult> GetByStudent(string studentId)
    {
        var gigs = await _gigService.GetByStudentIdAsync(studentId);

        var active = gigs.Where(g => g.Status == "Active").ToList();
        return Ok(active);
    }

    /// <summary>
    /// POST /api/gigs
    /// Создать новую услугу. Только для студентов.
    /// </summary>
    [HttpPost]
    [Authorize(Roles = "Student")]
    public async Task<IActionResult> Create([FromBody] CreateGigDto dto)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);

        try
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)!;
            var gigId = await _gigService.CreateAsync(userId, dto);

            return CreatedAtAction(
                nameof(GetById),
                new { id = gigId },
                new { id = gigId, message = "Услуга создана и отправлена на модерацию" });
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    /// <summary>
    /// PUT /api/gigs/{id}
    /// Обновить услугу. Только владелец (Student) или Admin.
    /// </summary>
    [HttpPut("{id:guid}")]
    [Authorize(Roles = "Student,Admin")]
    public async Task<IActionResult> Update(Guid id, [FromBody] UpdateGigDto dto)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);

        try
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)!;
            await _gigService.UpdateAsync(id, userId, dto);
            return NoContent(); // 204
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
        catch (UnauthorizedAccessException ex)
        {
            return Forbid(); // 403
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    /// <summary>
    /// DELETE /api/gigs/{id}
    /// Архивировать услугу (мягкое удаление). Владелец или Admin.
    /// </summary>
    [HttpDelete("{id:guid}")]
    [Authorize(Roles = "Student,Admin")]
    public async Task<IActionResult> Delete(Guid id)
    {
        try
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)!;
            var isAdmin = User.IsInRole("Admin");
            await _gigService.DeleteAsync(id, userId, isAdmin);
            return NoContent();
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
        catch (UnauthorizedAccessException)
        {
            return Forbid();
        }
    }
}