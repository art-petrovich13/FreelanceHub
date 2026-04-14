using FreeLanceHub.Core.DTOs.Common;
using FreeLanceHub.Core.DTOs.Orders;
using FreeLanceHub.Core.Entities;
using FreeLanceHub.Core.Enums;
using FreeLanceHub.Core.Interfaces;
using FreeLanceHub.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace FreeLanceHub.Infrastructure.Services;

public class OrderService : IOrderService
{
    private readonly ApplicationDbContext _db;

    public OrderService(ApplicationDbContext db) => _db = db;

    // ─────────────────────────────────────────────────────────────
    // ПОЛУЧИТЬ СПИСОК
    // ─────────────────────────────────────────────────────────────
    public async Task<PagedResponseDto<OrderListItemDto>> GetOrdersAsync(
        int page, int pageSize, Guid? categoryId, string? search, string? sortBy)
    {
        // Показываем только открытые заказы в публичном списке
        var query = _db.Orders
            .Where(o => o.Status == OrderStatus.Open)
            .Include(o => o.Employer)
            .Include(o => o.Category)
            .Include(o => o.OrderSkills).ThenInclude(os => os.Skill)
            .Include(o => o.Proposals)
            .AsQueryable();

        // ── Фильтры ──
        if (categoryId.HasValue)
            query = query.Where(o => o.CategoryId == categoryId.Value);

        if (!string.IsNullOrWhiteSpace(search))
        {
            var term = search.ToLower();
            query = query.Where(o =>
                o.Title.ToLower().Contains(term) ||
                o.Description.ToLower().Contains(term));
        }

        // ── Сортировка ──
        query = sortBy switch
        {
            "budget_asc" => query.OrderBy(o => o.Budget),
            "budget_desc" => query.OrderByDescending(o => o.Budget),
            "deadline" => query.OrderBy(o => o.Deadline),
            "oldest" => query.OrderBy(o => o.CreatedAt),
            _ => query.OrderByDescending(o => o.CreatedAt)
        };

        var totalCount = await query.CountAsync();
        var totalPages = (int)Math.Ceiling((double)totalCount / pageSize);

        var items = await query
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
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
            })
            .ToListAsync();

        return new PagedResponseDto<OrderListItemDto>
        {
            Items = items,
            TotalCount = totalCount,
            Page = page,
            PageSize = pageSize,
            TotalPages = totalPages,
            HasNextPage = page < totalPages,
            HasPreviousPage = page > 1
        };
    }

    // ─────────────────────────────────────────────────────────────
    // ПОЛУЧИТЬ ПО ID
    // ─────────────────────────────────────────────────────────────
    public async Task<OrderDetailDto?> GetByIdAsync(Guid id)
    {
        var order = await _db.Orders
            .Include(o => o.Employer)
            .Include(o => o.Category)
            .Include(o => o.SelectedStudent)
            .Include(o => o.OrderSkills).ThenInclude(os => os.Skill)
            .Include(o => o.Proposals)
            .FirstOrDefaultAsync(o => o.Id == id);

        if (order == null) return null;

        return new OrderDetailDto
        {
            Id = order.Id,
            Title = order.Title,
            Description = order.Description,
            Budget = order.Budget,
            Deadline = order.Deadline,
            Status = order.Status.ToString(),
            CreatedAt = order.CreatedAt,
            UpdatedAt = order.UpdatedAt,
            CategoryId = order.CategoryId,
            CategoryName = order.Category.Name,
            EmployerId = order.EmployerId,
            EmployerName = order.Employer.FirstName + " " + order.Employer.LastName,
            EmployerAvatar = order.Employer.AvatarUrl,
            SelectedStudentId = order.SelectedStudentId,
            SelectedStudentName = order.SelectedStudent != null
                ? order.SelectedStudent.FirstName + " " + order.SelectedStudent.LastName
                : null,
            Skills = order.OrderSkills
                .Select(os => new OrderSkillDto { Id = os.SkillId, Name = os.Skill.Name })
                .ToList(),
            ProposalCount = order.Proposals.Count
        };
    }

    // ─────────────────────────────────────────────────────────────
    // ПОЛУЧИТЬ ПО РАБОТОДАТЕЛЮ
    // ─────────────────────────────────────────────────────────────
    public async Task<List<OrderListItemDto>> GetByEmployerIdAsync(string employerId)
    {
        return await _db.Orders
            .Where(o => o.EmployerId == employerId)
            .Include(o => o.Category)
            .Include(o => o.OrderSkills).ThenInclude(os => os.Skill)
            .Include(o => o.Proposals)
            .Include(o => o.Employer)
            .OrderByDescending(o => o.CreatedAt)
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
            })
            .ToListAsync();
    }

    // ─────────────────────────────────────────────────────────────
    // ПОЛУЧИТЬ АКТИВНЫЕ ЗАКАЗЫ СТУДЕНТА
    // ─────────────────────────────────────────────────────────────
    public async Task<List<OrderListItemDto>> GetActiveForStudentAsync(string studentId)
    {
        return await _db.Orders
            .Where(o => o.SelectedStudentId == studentId &&
                        (o.Status == OrderStatus.InProgress || o.Status == OrderStatus.Completed))
            .Include(o => o.Category)
            .Include(o => o.Employer)
            .Include(o => o.OrderSkills).ThenInclude(os => os.Skill)
            .Include(o => o.Proposals)
            .OrderByDescending(o => o.UpdatedAt)
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
            })
            .ToListAsync();
    }

    // ─────────────────────────────────────────────────────────────
    // СОЗДАТЬ ЗАКАЗ
    // ─────────────────────────────────────────────────────────────
    public async Task<Guid> CreateAsync(string employerId, CreateOrderDto dto)
    {
        var categoryExists = await _db.Categories.AnyAsync(c => c.Id == dto.CategoryId);
        if (!categoryExists)
            throw new Exception("Категория не найдена");

        // Дедлайн не должен быть в прошлом
        if (dto.Deadline <= DateOnly.FromDateTime(DateTime.UtcNow))
            throw new Exception("Дедлайн должен быть в будущем");

        var order = new Order
        {
            EmployerId = employerId,
            CategoryId = dto.CategoryId,
            Title = dto.Title,
            Description = dto.Description,
            Budget = dto.Budget,
            Deadline = dto.Deadline,
            Status = OrderStatus.Open,   // Сразу открытый — модерации нет
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        _db.Orders.Add(order);

        // Добавляем навыки
        if (dto.SkillIds != null && dto.SkillIds.Count > 0)
        {
            foreach (var skillId in dto.SkillIds.Distinct())
            {
                var exists = await _db.Skills.AnyAsync(s => s.Id == skillId);
                if (exists)
                    _db.OrderSkills.Add(new OrderSkill { OrderId = order.Id, SkillId = skillId });
            }
        }

        await _db.SaveChangesAsync();
        return order.Id;
    }

    // ─────────────────────────────────────────────────────────────
    // ЗАВЕРШИТЬ (студент сигнализирует что работа выполнена)
    // ─────────────────────────────────────────────────────────────
    public async Task CompleteByStudentAsync(Guid orderId, string studentId)
    {
        var order = await _db.Orders.FindAsync(orderId)
            ?? throw new KeyNotFoundException("Заказ не найден");

        if (order.SelectedStudentId != studentId)
            throw new UnauthorizedAccessException("Вы не являетесь исполнителем этого заказа");

        if (order.Status != OrderStatus.InProgress)
            throw new Exception($"Нельзя завершить заказ в статусе {order.Status}");

        // Студент нажал "Работа выполнена" — ждём подтверждения работодателя
        // Для простоты сразу ставим Completed (работодатель подтвердит)
        // Если нужна двухшаговая логика — добавить промежуточный статус
        order.Status = OrderStatus.Completed;
        order.UpdatedAt = DateTime.UtcNow;

        // Уведомление работодателю
        var employer = await _db.Users.FindAsync(order.EmployerId);
        if (employer != null)
        {
            _db.Notifications.Add(new Notification
            {
                UserId = order.EmployerId,
                Title = "Исполнитель завершил работу",
                Message = $"Студент сообщил о завершении заказа «{order.Title}». " +
                          "Пожалуйста, проверьте результат и подтвердите завершение."
            });
        }

        await _db.SaveChangesAsync();
    }

    // ─────────────────────────────────────────────────────────────
    // ПОДТВЕРДИТЬ ЗАВЕРШЕНИЕ (работодатель)
    // ─────────────────────────────────────────────────────────────
    public async Task ConfirmCompletionAsync(Guid orderId, string employerId)
    {
        var order = await _db.Orders.FindAsync(orderId)
            ?? throw new KeyNotFoundException("Заказ не найден");

        if (order.EmployerId != employerId)
            throw new UnauthorizedAccessException("Вы не являетесь владельцем этого заказа");

        if (order.Status != OrderStatus.Completed)
            throw new Exception("Заказ ещё не отмечен как выполненный исполнителем");

        order.UpdatedAt = DateTime.UtcNow;

        // Уведомление студенту
        if (order.SelectedStudentId != null)
        {
            _db.Notifications.Add(new Notification
            {
                UserId = order.SelectedStudentId,
                Title = "Заказ завершён!",
                Message = $"Работодатель подтвердил завершение заказа «{order.Title}». " +
                          "Теперь вы можете оставить отзыв."
            });
        }

        await _db.SaveChangesAsync();
    }

    // ─────────────────────────────────────────────────────────────
    // ОТМЕНИТЬ ЗАКАЗ
    // ─────────────────────────────────────────────────────────────
    public async Task CancelAsync(Guid orderId, string employerId)
    {
        var order = await _db.Orders.FindAsync(orderId)
            ?? throw new KeyNotFoundException("Заказ не найден");

        if (order.EmployerId != employerId)
            throw new UnauthorizedAccessException("Вы не являетесь владельцем этого заказа");

        if (order.Status == OrderStatus.Completed)
            throw new Exception("Нельзя отменить завершённый заказ");

        if (order.Status == OrderStatus.Cancelled)
            throw new Exception("Заказ уже отменён");

        order.Status = OrderStatus.Cancelled;
        order.UpdatedAt = DateTime.UtcNow;

        // Уведомление выбранному студенту (если был)
        if (order.SelectedStudentId != null)
        {
            _db.Notifications.Add(new Notification
            {
                UserId = order.SelectedStudentId,
                Title = "Заказ отменён",
                Message = $"Работодатель отменил заказ «{order.Title}»."
            });
        }

        await _db.SaveChangesAsync();
    }
}