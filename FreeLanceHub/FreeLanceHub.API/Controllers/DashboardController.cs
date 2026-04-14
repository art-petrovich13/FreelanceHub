using FreeLanceHub.Core.DTOs.Dashboard;
using FreeLanceHub.Core.DTOs.Gigs;
using FreeLanceHub.Core.DTOs.Orders;
using FreeLanceHub.Core.DTOs.Proposals;
using FreeLanceHub.Core.Enums;
using FreeLanceHub.Core.Interfaces;
using FreeLanceHub.Infrastructure.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace FreeLanceHub.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class DashboardController : ControllerBase
{
    private readonly ApplicationDbContext _db;
    private readonly INotificationService _notificationService;

    public DashboardController(
        ApplicationDbContext db,
        INotificationService notificationService)
    {
        _db = db;
        _notificationService = notificationService;
    }

    private string UserId => User.FindFirstValue(ClaimTypes.NameIdentifier)!;

    // ─────────────────────────────────────────────────────────────
    /// <summary>
    /// GET /api/dashboard/student
    /// Дашборд студента: услуги, отклики, активные заказы.
    /// </summary>
    [HttpGet("student")]
    [Authorize(Roles = "Student,Admin")]
    public async Task<IActionResult> GetStudentDashboard()
    {
        var userId = UserId;

        // Услуги студента
        var gigs = await _db.Gigs
            .Where(g => g.StudentId == userId)
            .Include(g => g.Category)
            .Include(g => g.GigSkills).ThenInclude(gs => gs.Skill)
            .Include(g => g.Student)
            .OrderByDescending(g => g.CreatedAt)
            .ToListAsync();

        // Отклики студента
        var proposals = await _db.Proposals
            .Where(p => p.StudentId == userId)
            .Include(p => p.Student)
            .OrderByDescending(p => p.CreatedAt)
            .ToListAsync();

        // Заказы где студент — исполнитель
        var activeOrders = await _db.Orders
            .Where(o => o.SelectedStudentId == userId &&
                        (o.Status == OrderStatus.InProgress ||
                         o.Status == OrderStatus.Completed))
            .Include(o => o.Category)
            .Include(o => o.Employer)
            .Include(o => o.OrderSkills).ThenInclude(os => os.Skill)
            .Include(o => o.Proposals)
            .OrderByDescending(o => o.UpdatedAt)
            .ToListAsync();

        // Сумма заработка по завершённым заказам
        // Берём ProposedPrice из принятых откликов студента
        var totalEarned = await _db.Proposals
            .Where(p => p.StudentId == userId && p.Status == ProposalStatus.Accepted)
            .Include(p => p.Order)
            .Where(p => p.Order.Status == OrderStatus.Completed)
            .SumAsync(p => p.ProposedPrice);

        var unreadCount = await _notificationService.GetUnreadCountAsync(userId);

        var dto = new StudentDashboardDto
        {
            TotalGigs = gigs.Count,
            ActiveGigs = gigs.Count(g => g.Status == GigStatus.Active),
            PendingGigs = gigs.Count(g => g.Status == GigStatus.Pending),
            TotalProposals = proposals.Count,
            AcceptedProposals = proposals.Count(p => p.Status == ProposalStatus.Accepted),
            ActiveOrders = activeOrders.Count(o => o.Status == OrderStatus.InProgress),
            CompletedOrders = activeOrders.Count(o => o.Status == OrderStatus.Completed),
            UnreadNotifications = unreadCount,
            TotalEarned = totalEarned,

            RecentGigs = gigs.Take(5).Select(g => new GigListItemDto
            {
                Id = g.Id,
                Title = g.Title,
                Price = g.Price,
                DeliveryDays = g.DeliveryDays,
                CategoryName = g.Category.Name,
                StudentId = g.StudentId,
                StudentName = g.Student.FirstName + " " + g.Student.LastName,
                StudentRating = g.Student.Rating,
                Status = g.Status.ToString(),
                Skills = g.GigSkills.Select(gs => gs.Skill.Name).ToList(),
                CreatedAt = g.CreatedAt
            }).ToList(),

            ActiveOrdersList = activeOrders
                .Where(o => o.Status == OrderStatus.InProgress)
                .Take(5)
                .Select(o => new OrderListItemDto
                {
                    Id = o.Id,
                    Title = o.Title,
                    Budget = o.Budget,
                    Deadline = o.Deadline,
                    CategoryName = o.Category.Name,
                    EmployerId = o.EmployerId,
                    EmployerName = o.Employer.FirstName + " " + o.Employer.LastName,
                    Status = o.Status.ToString(),
                    ProposalCount = o.Proposals.Count,
                    Skills = o.OrderSkills.Select(os => os.Skill.Name).ToList(),
                    CreatedAt = o.CreatedAt
                }).ToList(),

            RecentProposals = proposals.Take(5).Select(p => new ProposalDto
            {
                Id = p.Id,
                OrderId = p.OrderId,
                StudentId = p.StudentId,
                StudentName = p.Student.FirstName + " " + p.Student.LastName,
                CoverLetter = p.CoverLetter,
                ProposedPrice = p.ProposedPrice,
                ProposedDays = p.ProposedDays,
                Status = p.Status.ToString(),
                CreatedAt = p.CreatedAt
            }).ToList()
        };

        return Ok(dto);
    }

    // ─────────────────────────────────────────────────────────────
    /// <summary>
    /// GET /api/dashboard/employer
    /// Дашборд работодателя: заказы, отклики, исполнители.
    /// </summary>
    [HttpGet("employer")]
    [Authorize(Roles = "Employer,Admin")]
    public async Task<IActionResult> GetEmployerDashboard()
    {
        var userId = UserId;

        // Все заказы работодателя
        var orders = await _db.Orders
            .Where(o => o.EmployerId == userId)
            .Include(o => o.Category)
            .Include(o => o.SelectedStudent)
            .Include(o => o.Employer)
            .Include(o => o.OrderSkills).ThenInclude(os => os.Skill)
            .Include(o => o.Proposals)
            .OrderByDescending(o => o.CreatedAt)
            .ToListAsync();

        // Отклики ожидающие решения по всем заказам работодателя
        var orderIds = orders.Select(o => o.Id).ToList();
        var pendingProposals = await _db.Proposals
            .Where(p => orderIds.Contains(p.OrderId) &&
                        p.Status == ProposalStatus.Pending)
            .Include(p => p.Student)
            .Include(p => p.Order)
            .OrderByDescending(p => p.CreatedAt)
            .Take(5)
            .ToListAsync();

        // Сумма потраченного
        var totalSpent = await _db.Proposals
            .Where(p => orderIds.Contains(p.OrderId) &&
                        p.Status == ProposalStatus.Accepted)
            .Include(p => p.Order)
            .Where(p => p.Order.Status == OrderStatus.Completed)
            .SumAsync(p => p.ProposedPrice);

        var unreadCount = await _notificationService.GetUnreadCountAsync(userId);

        var toListItem = (Core.Entities.Order o) => new OrderListItemDto
        {
            Id = o.Id,
            Title = o.Title,
            Budget = o.Budget,
            Deadline = o.Deadline,
            CategoryName = o.Category.Name,
            EmployerId = o.EmployerId,
            EmployerName = o.Employer.FirstName + " " + o.Employer.LastName,
            Status = o.Status.ToString(),
            ProposalCount = o.Proposals.Count,
            Skills = o.OrderSkills.Select(os => os.Skill.Name).ToList(),
            CreatedAt = o.CreatedAt
        };

        var dto = new EmployerDashboardDto
        {
            TotalOrders = orders.Count,
            OpenOrders = orders.Count(o => o.Status == OrderStatus.Open),
            InProgressOrders = orders.Count(o => o.Status == OrderStatus.InProgress),
            CompletedOrders = orders.Count(o => o.Status == OrderStatus.Completed),
            TotalProposalsReceived = orders.Sum(o => o.Proposals.Count),
            PendingProposals = orders.Sum(o =>
                o.Proposals.Count(p => p.Status == ProposalStatus.Pending)),
            UnreadNotifications = unreadCount,
            TotalSpent = totalSpent,

            OpenOrdersList = orders
                .Where(o => o.Status == OrderStatus.Open)
                .Take(5)
                .Select(o => toListItem(o))
                .ToList(),

            InProgressOrdersList = orders
                .Where(o => o.Status == OrderStatus.InProgress)
                .Take(5)
                .Select(o => toListItem(o))
                .ToList(),

            RecentPendingProposals = pendingProposals
                .Select(p => new RecentProposalWithOrderDto
                {
                    ProposalId = p.Id,
                    OrderTitle = p.Order.Title,
                    OrderId = p.OrderId,
                    StudentName = p.Student.FirstName + " " + p.Student.LastName,
                    ProposedPrice = p.ProposedPrice,
                    ProposedDays = p.ProposedDays,
                    CreatedAt = p.CreatedAt
                })
                .ToList()
        };

        return Ok(dto);
    }
}