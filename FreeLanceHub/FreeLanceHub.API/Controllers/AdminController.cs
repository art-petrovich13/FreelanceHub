using FreeLanceHub.Core.DTOs.Admin;
using FreeLanceHub.Core.Entities;
using FreeLanceHub.Core.Enums;
using FreeLanceHub.Infrastructure.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace FreeLanceHub.API.Controllers;

/// <summary>
/// Контроллер административной панели.
/// ВСЕ эндпоинты защищены роль Admin.
/// </summary>
[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "Admin")]
public class AdminController : ControllerBase
{
    private readonly ApplicationDbContext _db;
    private readonly UserManager<ApplicationUser> _userManager;

    public AdminController(
        ApplicationDbContext db,
        UserManager<ApplicationUser> userManager)
    {
        _db = db;
        _userManager = userManager;
    }

    // ═══════════════════════════════════════════════════════════
    // СТАТИСТИКА
    // ═══════════════════════════════════════════════════════════

    /// <summary>
    /// GET /api/admin/stats
    /// Сводная статистика платформы для дашборда.
    /// </summary>
    [HttpGet("stats")]
    public async Task<IActionResult> GetStats()
    {
        var now = DateTime.UtcNow;
        var weekAgo = now.AddDays(-7);

        var students = await _userManager.GetUsersInRoleAsync("Student");
        var employers = await _userManager.GetUsersInRoleAsync("Employer");

        var stats = new PlatformStatsDto
        {
            // Пользователи
            TotalUsers = await _db.Users.CountAsync(),
            TotalStudents = students.Count,
            TotalEmployers = employers.Count,
            BlockedUsers = await _db.Users.CountAsync(u => u.IsBlocked),

            // Услуги
            TotalGigs = await _db.Gigs.CountAsync(),
            ActiveGigs = await _db.Gigs.CountAsync(g => g.Status == GigStatus.Active),
            PendingGigs = await _db.Gigs.CountAsync(g => g.Status == GigStatus.Pending),
            RejectedGigs = await _db.Gigs.CountAsync(g => g.Status == GigStatus.Rejected),

            // Заказы
            TotalOrders = await _db.Orders.CountAsync(),
            OpenOrders = await _db.Orders.CountAsync(o => o.Status == OrderStatus.Open),
            InProgressOrders = await _db.Orders.CountAsync(o => o.Status == OrderStatus.InProgress),
            CompletedOrders = await _db.Orders.CountAsync(o => o.Status == OrderStatus.Completed),

            // Отклики и отзывы
            TotalProposals = await _db.Proposals.CountAsync(),
            TotalReviews = await _db.Reviews.CountAsync(),

            // Новые за 7 дней
            NewUsersThisWeek = await _db.Users.CountAsync(u => u.CreatedAt >= weekAgo),
            NewOrdersThisWeek = await _db.Orders.CountAsync(o => o.CreatedAt >= weekAgo),
            NewGigsThisWeek = await _db.Gigs.CountAsync(g => g.CreatedAt >= weekAgo),
        };

        return Ok(stats);
    }

    // ═══════════════════════════════════════════════════════════
    // УПРАВЛЕНИЕ ПОЛЬЗОВАТЕЛЯМИ
    // ═══════════════════════════════════════════════════════════

    /// <summary>
    /// GET /api/admin/users
    /// Список всех пользователей с пагинацией и поиском.
    /// </summary>
    [HttpGet("users")]
    public async Task<IActionResult> GetUsers(
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 20,
        [FromQuery] string? search = null,
        [FromQuery] string? role = null,
        [FromQuery] bool? blocked = null)
    {
        var query = _db.Users
            .Include(u => u.Gigs)
            .Include(u => u.Orders)
            .AsQueryable();

        if (!string.IsNullOrWhiteSpace(search))
        {
            var term = search.ToLower();
            query = query.Where(u =>
                u.Email!.ToLower().Contains(term) ||
                u.FirstName.ToLower().Contains(term) ||
                u.LastName.ToLower().Contains(term));
        }

        if (blocked.HasValue)
            query = query.Where(u => u.IsBlocked == blocked.Value);

        query = query.OrderByDescending(u => u.CreatedAt);

        var totalCount = await query.CountAsync();
        var totalPages = (int)Math.Ceiling((double)totalCount / pageSize);

        var users = await query
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        // Получаем роли для каждого пользователя
        var result = new List<AdminUserDto>();
        foreach (var user in users)
        {
            var roles = await _userManager.GetRolesAsync(user);
            var userRole = roles.FirstOrDefault() ?? "Student";

            // Фильтр по роли (делаем после получения ролей)
            if (!string.IsNullOrWhiteSpace(role) &&
                !string.Equals(userRole, role, StringComparison.OrdinalIgnoreCase))
                continue;

            result.Add(new AdminUserDto
            {
                Id = user.Id,
                Email = user.Email!,
                FirstName = user.FirstName,
                LastName = user.LastName,
                University = user.University,
                Rating = user.Rating,
                ReviewCount = user.ReviewCount,
                IsBlocked = user.IsBlocked,
                CreatedAt = user.CreatedAt,
                Role = userRole,
                GigsCount = user.Gigs.Count,
                OrdersCount = user.Orders.Count,
            });
        }

        return Ok(new
        {
            items = result,
            totalCount = totalCount,
            page = page,
            pageSize = pageSize,
            totalPages = totalPages
        });
    }

    /// <summary>
    /// PUT /api/admin/users/{id}/block
    /// Заблокировать или разблокировать пользователя.
    /// Body: true (заблокировать) или false (разблокировать)
    /// </summary>
    [HttpPut("users/{id}/block")]
    public async Task<IActionResult> SetBlock(string id, [FromBody] bool isBlocked)
    {
        // Нельзя заблокировать самого себя
        var currentUserId = User.FindFirstValue(ClaimTypes.NameIdentifier)!;
        if (id == currentUserId)
            return BadRequest(new { message = "Нельзя заблокировать свой аккаунт" });

        var user = await _userManager.FindByIdAsync(id);
        if (user == null)
            return NotFound(new { message = "Пользователь не найден" });

        user.IsBlocked = isBlocked;
        await _userManager.UpdateAsync(user);

        return Ok(new
        {
            message = isBlocked
                ? $"Пользователь {user.Email} заблокирован"
                : $"Пользователь {user.Email} разблокирован"
        });
    }

    /// <summary>
    /// PUT /api/admin/users/{id}/role
    /// Изменить роль пользователя.
    /// </summary>
    [HttpPut("users/{id}/role")]
    public async Task<IActionResult> ChangeRole(string id, [FromBody] ChangeUserRoleDto dto)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);

        var currentUserId = User.FindFirstValue(ClaimTypes.NameIdentifier)!;
        if (id == currentUserId)
            return BadRequest(new { message = "Нельзя изменить свою роль" });

        var user = await _userManager.FindByIdAsync(id);
        if (user == null)
            return NotFound(new { message = "Пользователь не найден" });

        // Удаляем все текущие роли
        var currentRoles = await _userManager.GetRolesAsync(user);
        await _userManager.RemoveFromRolesAsync(user, currentRoles);

        // Назначаем новую роль
        var result = await _userManager.AddToRoleAsync(user, dto.NewRole);
        if (!result.Succeeded)
            return BadRequest(new
            {
                message = string.Join(", ", result.Errors.Select(e => e.Description))
            });

        return Ok(new { message = $"Роль пользователя изменена на {dto.NewRole}" });
    }

    /// <summary>
    /// DELETE /api/admin/users/{id}
    /// Удалить пользователя (осторожно — каскадное удаление данных).
    /// </summary>
    [HttpDelete("users/{id}")]
    public async Task<IActionResult> DeleteUser(string id)
    {
        var currentUserId = User.FindFirstValue(ClaimTypes.NameIdentifier)!;
        if (id == currentUserId)
            return BadRequest(new { message = "Нельзя удалить свой аккаунт" });

        var user = await _userManager.FindByIdAsync(id);
        if (user == null)
            return NotFound(new { message = "Пользователь не найден" });

        var result = await _userManager.DeleteAsync(user);
        if (!result.Succeeded)
            return BadRequest(new
            {
                message = string.Join(", ", result.Errors.Select(e => e.Description))
            });

        return Ok(new { message = "Пользователь удалён" });
    }

    // ═══════════════════════════════════════════════════════════
    // МОДЕРАЦИЯ УСЛУГ
    // ═══════════════════════════════════════════════════════════

    /// <summary>
    /// GET /api/admin/gigs
    /// Все услуги (все статусы) с пагинацией и фильтром по статусу.
    /// </summary>
    [HttpGet("gigs")]
    public async Task<IActionResult> GetGigs(
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 20,
        [FromQuery] string? status = null,
        [FromQuery] string? search = null)
    {
        var query = _db.Gigs
            .Include(g => g.Student)
            .Include(g => g.Category)
            .AsQueryable();

        // Фильтр по статусу
        if (!string.IsNullOrWhiteSpace(status) &&
            Enum.TryParse<GigStatus>(status, true, out var gigStatus))
        {
            query = query.Where(g => g.Status == gigStatus);
        }

        // Поиск по заголовку
        if (!string.IsNullOrWhiteSpace(search))
        {
            var term = search.ToLower();
            query = query.Where(g => g.Title.ToLower().Contains(term));
        }

        query = query.OrderByDescending(g => g.CreatedAt);

        var totalCount = await query.CountAsync();
        var totalPages = (int)Math.Ceiling((double)totalCount / pageSize);

        var items = await query
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(g => new AdminGigDto
            {
                Id = g.Id,
                Title = g.Title,
                Price = g.Price,
                DeliveryDays = g.DeliveryDays,
                Status = g.Status.ToString(),
                CategoryName = g.Category.Name,
                StudentId = g.StudentId,
                StudentName = g.Student.FirstName + " " + g.Student.LastName,
                StudentEmail = g.Student.Email!,
                CreatedAt = g.CreatedAt,
                UpdatedAt = g.UpdatedAt
            })
            .ToListAsync();

        return Ok(new
        {
            items,
            totalCount,
            page,
            pageSize,
            totalPages
        });
    }

    /// <summary>
    /// PUT /api/admin/gigs/{id}/status
    /// Изменить статус услуги: одобрить (approve), отклонить (reject), архивировать (archive).
    /// </summary>
    [HttpPut("gigs/{id:guid}/status")]
    public async Task<IActionResult> ChangeGigStatus(Guid id, [FromBody] ChangeGigStatusDto dto)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);

        var gig = await _db.Gigs.FindAsync(id);
        if (gig == null)
            return NotFound(new { message = "Услуга не найдена" });

        GigStatus newStatus = dto.Action switch
        {
            "approve" => GigStatus.Active,
            "reject" => GigStatus.Rejected,
            "archive" => GigStatus.Archived,
            _ => throw new Exception("Неизвестное действие")
        };

        gig.Status = newStatus;
        gig.UpdatedAt = DateTime.UtcNow;

        // Уведомление студенту
        string notifTitle = dto.Action == "approve"
            ? "Ваша услуга одобрена! ✅"
            : "Услуга отклонена";

        string notifMessage = dto.Action == "approve"
            ? $"Услуга «{gig.Title}» прошла модерацию и теперь видна всем пользователям."
            : $"Услуга «{gig.Title}» была отклонена модератором." +
              (dto.Reason != null ? $" Причина: {dto.Reason}" : "");

        _db.Notifications.Add(new Notification
        {
            UserId = gig.StudentId,
            Title = notifTitle,
            Message = notifMessage
        });

        await _db.SaveChangesAsync();

        return Ok(new
        {
            message = $"Статус услуги изменён на {newStatus}"
        });
    }

    // ═══════════════════════════════════════════════════════════
    // УПРАВЛЕНИЕ ЗАКАЗАМИ
    // ═══════════════════════════════════════════════════════════

    /// <summary>
    /// GET /api/admin/orders
    /// Все заказы с пагинацией и фильтром по статусу.
    /// </summary>
    [HttpGet("orders")]
    public async Task<IActionResult> GetOrders(
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 20,
        [FromQuery] string? status = null,
        [FromQuery] string? search = null)
    {
        var query = _db.Orders
            .Include(o => o.Employer)
            .Include(o => o.Category)
            .Include(o => o.SelectedStudent)
            .Include(o => o.Proposals)
            .AsQueryable();

        if (!string.IsNullOrWhiteSpace(status) &&
            Enum.TryParse<OrderStatus>(status, true, out var orderStatus))
        {
            query = query.Where(o => o.Status == orderStatus);
        }

        if (!string.IsNullOrWhiteSpace(search))
        {
            var term = search.ToLower();
            query = query.Where(o => o.Title.ToLower().Contains(term));
        }

        query = query.OrderByDescending(o => o.CreatedAt);

        var totalCount = await query.CountAsync();
        var totalPages = (int)Math.Ceiling((double)totalCount / pageSize);

        var items = await query
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(o => new AdminOrderDto
            {
                Id = o.Id,
                Title = o.Title,
                Budget = o.Budget,
                Status = o.Status.ToString(),
                CategoryName = o.Category.Name,
                EmployerId = o.EmployerId,
                EmployerName = o.Employer.FirstName + " " + o.Employer.LastName,
                EmployerEmail = o.Employer.Email!,
                SelectedStudentName = o.SelectedStudent != null
                    ? o.SelectedStudent.FirstName + " " + o.SelectedStudent.LastName
                    : null,
                ProposalCount = o.Proposals.Count,
                CreatedAt = o.CreatedAt,
                Deadline = o.Deadline
            })
            .ToListAsync();

        return Ok(new { items, totalCount, page, pageSize, totalPages });
    }

    /// <summary>
    /// PUT /api/admin/orders/{id}/status
    /// Изменить статус заказа администратором.
    /// Action: "cancel" → Cancelled, "reject" → Rejected, "reopen" → Open
    /// </summary>
    [HttpPut("orders/{id:guid}/status")]
    public async Task<IActionResult> ChangeOrderStatus(
        Guid id, [FromBody] string action)
    {
        var order = await _db.Orders.FindAsync(id);
        if (order == null)
            return NotFound(new { message = "Заказ не найден" });

        OrderStatus newStatus = action.ToLower() switch
        {
            "cancel" => OrderStatus.Cancelled,
            "reject" => OrderStatus.Rejected,
            "reopen" => OrderStatus.Open,
            _ => throw new Exception($"Неизвестное действие: {action}")
        };

        order.Status = newStatus;
        order.UpdatedAt = DateTime.UtcNow;

        await _db.SaveChangesAsync();

        return Ok(new { message = $"Статус заказа изменён на {newStatus}" });
    }

    // ═══════════════════════════════════════════════════════════
    // ПРОСМОТР ОТЗЫВОВ И УВЕДОМЛЕНИЙ
    // ═══════════════════════════════════════════════════════════

    /// <summary>
    /// GET /api/admin/reviews
    /// Все отзывы на платформе (для модерации контента).
    /// </summary>
    [HttpGet("reviews")]
    public async Task<IActionResult> GetReviews(
        [FromQuery] int page = 1, [FromQuery] int pageSize = 20)
    {
        var totalCount = await _db.Reviews.CountAsync();
        var totalPages = (int)Math.Ceiling((double)totalCount / pageSize);

        var items = await _db.Reviews
            .Include(r => r.Reviewer)
            .Include(r => r.Reviewee)
            .Include(r => r.Order)
            .OrderByDescending(r => r.CreatedAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(r => new
            {
                r.Id,
                r.Rating,
                r.Comment,
                r.CreatedAt,
                OrderTitle = r.Order.Title,
                ReviewerName = r.Reviewer.FirstName + " " + r.Reviewer.LastName,
                ReviewerEmail = r.Reviewer.Email,
                RevieweeName = r.Reviewee.FirstName + " " + r.Reviewee.LastName,
            })
            .ToListAsync();

        return Ok(new { items, totalCount, page, pageSize, totalPages });
    }

    /// <summary>
    /// DELETE /api/admin/reviews/{id}
    /// Удалить отзыв (модерация контента).
    /// После удаления пересчитывает рейтинг пользователя.
    /// </summary>
    [HttpDelete("reviews/{id:guid}")]
    public async Task<IActionResult> DeleteReview(Guid id)
    {
        var review = await _db.Reviews.FindAsync(id);
        if (review == null)
            return NotFound(new { message = "Отзыв не найден" });

        var revieweeId = review.RevieweeId;

        _db.Reviews.Remove(review);
        await _db.SaveChangesAsync();

        // Пересчитываем рейтинг
        var user = await _db.Users.FindAsync(revieweeId);
        if (user != null)
        {
            var ratings = await _db.Reviews
                .Where(r => r.RevieweeId == revieweeId)
                .Select(r => (double)r.Rating)
                .ToListAsync();

            user.Rating = ratings.Count > 0 ? (decimal)Math.Round(ratings.Average(), 2) : 0;
            user.ReviewCount = ratings.Count;
            await _db.SaveChangesAsync();
        }

        return Ok(new { message = "Отзыв удалён, рейтинг пересчитан" });
    }
}