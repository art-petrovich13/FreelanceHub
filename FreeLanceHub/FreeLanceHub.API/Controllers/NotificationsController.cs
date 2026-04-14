using FreeLanceHub.Core.DTOs.Notifications;
using System.Security.Claims;
using FreeLanceHub.Core.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace FreeLanceHub.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]  // Все эндпоинты требуют авторизации
public class NotificationsController : ControllerBase
{
    private readonly INotificationService _notificationService;

    public NotificationsController(INotificationService notificationService)
        => _notificationService = notificationService;

    private string UserId => User.FindFirstValue(ClaimTypes.NameIdentifier)!;

    // ─────────────────────────────────────────────────────────────
    /// <summary>
    /// GET /api/notifications
    /// Все уведомления текущего пользователя.
    /// Сначала непрочитанные, затем по дате.
    /// </summary>
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var notifications = await _notificationService.GetAllAsync(UserId);
        return Ok(notifications);
    }

    // ─────────────────────────────────────────────────────────────
    /// <summary>
    /// GET /api/notifications/unread-count
    /// Количество непрочитанных уведомлений (для бейджа в Header).
    /// </summary>
    [HttpGet("unread-count")]
    public async Task<IActionResult> GetUnreadCount()
    {
        var count = await _notificationService.GetUnreadCountAsync(UserId);
        return Ok(new { count });
    }

    // ─────────────────────────────────────────────────────────────
    /// <summary>
    /// PUT /api/notifications/{id}/read
    /// Пометить одно уведомление как прочитанное.
    /// </summary>
    [HttpPut("{id:guid}/read")]
    public async Task<IActionResult> MarkRead(Guid id)
    {
        try
        {
            await _notificationService.MarkReadAsync(id, UserId);
            return Ok(new { message = "Помечено как прочитанное" });
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
    }

    // ─────────────────────────────────────────────────────────────
    /// <summary>
    /// PUT /api/notifications/read-all
    /// Пометить ВСЕ уведомления как прочитанные.
    /// </summary>
    [HttpPut("read-all")]
    public async Task<IActionResult> MarkAllRead()
    {
        await _notificationService.MarkAllReadAsync(UserId);
        return Ok(new { message = "Все уведомления прочитаны" });
    }

    // ─────────────────────────────────────────────────────────────
    /// <summary>
    /// DELETE /api/notifications/{id}
    /// Удалить конкретное уведомление.
    /// </summary>
    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        try
        {
            await _notificationService.DeleteAsync(id, UserId);
            return NoContent();
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
    }
}