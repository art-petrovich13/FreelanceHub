using FreeLanceHub.Core.DTOs.Proposals;
using FreeLanceHub.Core.Entities;
using FreeLanceHub.Core.Enums;
using FreeLanceHub.Core.Interfaces;
using FreeLanceHub.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace FreeLanceHub.Infrastructure.Services;

public class ProposalService : IProposalService
{
    private readonly ApplicationDbContext _db;

    public ProposalService(ApplicationDbContext db) => _db = db;

    // ─────────────────────────────────────────────────────────────
    // СПИСОК ОТКЛИКОВ НА ЗАКАЗ
    // ─────────────────────────────────────────────────────────────
    public async Task<List<ProposalDto>> GetByOrderIdAsync(Guid orderId, string employerId)
    {
        // Проверяем что запрашивающий является владельцем заказа
        var order = await _db.Orders.FindAsync(orderId)
            ?? throw new KeyNotFoundException("Заказ не найден");

        if (order.EmployerId != employerId)
            throw new UnauthorizedAccessException("Нет доступа к откликам этого заказа");

        return await _db.Proposals
            .Where(p => p.OrderId == orderId)
            .Include(p => p.Student)
            .OrderByDescending(p => p.CreatedAt)
            .Select(p => new ProposalDto
            {
                Id = p.Id,
                OrderId = p.OrderId,
                StudentId = p.StudentId,
                StudentName = p.Student.FirstName + " " + p.Student.LastName,
                StudentAvatar = p.Student.AvatarUrl,
                StudentRating = p.Student.Rating,
                StudentReviews = p.Student.ReviewCount,
                StudentUniversity = p.Student.University,
                CoverLetter = p.CoverLetter,
                ProposedPrice = p.ProposedPrice,
                ProposedDays = p.ProposedDays,
                Status = p.Status.ToString(),
                CreatedAt = p.CreatedAt
            })
            .ToListAsync();
    }

    // ─────────────────────────────────────────────────────────────
    // МОИ ОТКЛИКИ (студент)
    // ─────────────────────────────────────────────────────────────
    public async Task<List<ProposalDto>> GetByStudentIdAsync(string studentId)
    {
        return await _db.Proposals
            .Where(p => p.StudentId == studentId)
            .Include(p => p.Student)
            .OrderByDescending(p => p.CreatedAt)
            .Select(p => new ProposalDto
            {
                Id = p.Id,
                OrderId = p.OrderId,
                StudentId = p.StudentId,
                StudentName = p.Student.FirstName + " " + p.Student.LastName,
                StudentAvatar = p.Student.AvatarUrl,
                StudentRating = p.Student.Rating,
                StudentReviews = p.Student.ReviewCount,
                CoverLetter = p.CoverLetter,
                ProposedPrice = p.ProposedPrice,
                ProposedDays = p.ProposedDays,
                Status = p.Status.ToString(),
                CreatedAt = p.CreatedAt
            })
            .ToListAsync();
    }

    // ─────────────────────────────────────────────────────────────
    // ПОДАТЬ ОТКЛИК
    // ─────────────────────────────────────────────────────────────
    public async Task<Guid> CreateAsync(string studentId, CreateProposalDto dto)
    {
        // 1. Проверяем что заказ существует и открыт
        var order = await _db.Orders.FindAsync(dto.OrderId)
            ?? throw new KeyNotFoundException("Заказ не найден");

        if (order.Status != OrderStatus.Open)
            throw new Exception("Нельзя откликнуться на заказ в статусе: " + order.Status);

        // 2. Студент не может откликнуться на свой заказ (если вдруг)
        if (order.EmployerId == studentId)
            throw new Exception("Нельзя откликнуться на свой заказ");

        // 3. Проверяем что студент уже не откликался на этот заказ
        var alreadyApplied = await _db.Proposals.AnyAsync(p =>
            p.OrderId == dto.OrderId && p.StudentId == studentId);

        if (alreadyApplied)
            throw new Exception("Вы уже подали отклик на этот заказ");

        var proposal = new Proposal
        {
            OrderId = dto.OrderId,
            StudentId = studentId,
            CoverLetter = dto.CoverLetter,
            ProposedPrice = dto.ProposedPrice,
            ProposedDays = dto.ProposedDays,
            Status = ProposalStatus.Pending,
            CreatedAt = DateTime.UtcNow
        };

        _db.Proposals.Add(proposal);

        // Уведомление работодателю о новом отклике
        var student = await _db.Users.FindAsync(studentId);
        _db.Notifications.Add(new Notification
        {
            UserId = order.EmployerId,
            Title = "Новый отклик на ваш заказ",
            Message = $"Студент {student?.FirstName} {student?.LastName} " +
                      $"откликнулся на заказ «{order.Title}»"
        });

        await _db.SaveChangesAsync();
        return proposal.Id;
    }

    // ─────────────────────────────────────────────────────────────
    // ПРИНЯТЬ ОТКЛИК (работодатель)
    // Атомарная операция: принимаем одного, отклоняем всех остальных,
    // обновляем статус заказа.
    // ─────────────────────────────────────────────────────────────
    public async Task AcceptAsync(Guid proposalId, string employerId)
    {
        // Загружаем отклик вместе с заказом
        var proposal = await _db.Proposals
            .Include(p => p.Order)
            .Include(p => p.Student)
            .FirstOrDefaultAsync(p => p.Id == proposalId)
            ?? throw new KeyNotFoundException("Отклик не найден");

        // Проверяем что работодатель является владельцем заказа
        if (proposal.Order.EmployerId != employerId)
            throw new UnauthorizedAccessException("Нет прав для принятия этого отклика");

        // Заказ должен быть открыт
        if (proposal.Order.Status != OrderStatus.Open)
            throw new Exception($"Нельзя принять отклик для заказа в статусе {proposal.Order.Status}");

        // 1. Принимаем выбранный отклик
        proposal.Status = ProposalStatus.Accepted;

        // 2. Отклоняем все остальные отклики на этот заказ
        var otherProposals = await _db.Proposals
            .Where(p => p.OrderId == proposal.OrderId &&
                        p.Id != proposalId &&
                        p.Status == ProposalStatus.Pending)
            .ToListAsync();

        foreach (var other in otherProposals)
            other.Status = ProposalStatus.Rejected;

        // 3. Обновляем заказ
        proposal.Order.Status = OrderStatus.InProgress;
        proposal.Order.SelectedStudentId = proposal.StudentId;
        proposal.Order.UpdatedAt = DateTime.UtcNow;

        // 4. Уведомление принятому студенту
        _db.Notifications.Add(new Notification
        {
            UserId = proposal.StudentId,
            Title = "Ваш отклик принят! 🎉",
            Message = $"Работодатель выбрал вас исполнителем заказа «{proposal.Order.Title}». " +
                      "Свяжитесь с заказчиком для уточнения деталей."
        });

        // 5. Уведомления отклонённым студентам
        foreach (var other in otherProposals)
        {
            _db.Notifications.Add(new Notification
            {
                UserId = other.StudentId,
                Title = "Отклик не принят",
                Message = $"К сожалению, работодатель выбрал другого исполнителя " +
                          $"для заказа «{proposal.Order.Title}»."
            });
        }

        await _db.SaveChangesAsync();
    }

    // ─────────────────────────────────────────────────────────────
    // ОТКЛОНИТЬ ОТКЛИК ВРУЧНУЮ
    // ─────────────────────────────────────────────────────────────
    public async Task RejectAsync(Guid proposalId, string employerId)
    {
        var proposal = await _db.Proposals
            .Include(p => p.Order)
            .FirstOrDefaultAsync(p => p.Id == proposalId)
            ?? throw new KeyNotFoundException("Отклик не найден");

        if (proposal.Order.EmployerId != employerId)
            throw new UnauthorizedAccessException("Нет прав для отклонения этого отклика");

        if (proposal.Status != ProposalStatus.Pending)
            throw new Exception($"Нельзя отклонить отклик в статусе {proposal.Status}");

        proposal.Status = ProposalStatus.Rejected;

        _db.Notifications.Add(new Notification
        {
            UserId = proposal.StudentId,
            Title = "Отклик отклонён",
            Message = $"Ваш отклик на заказ «{proposal.Order.Title}» был отклонён."
        });

        await _db.SaveChangesAsync();
    }
}