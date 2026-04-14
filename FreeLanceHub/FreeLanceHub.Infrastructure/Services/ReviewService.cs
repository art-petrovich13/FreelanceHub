using FreeLanceHub.Core.DTOs.Reviews;
using FreeLanceHub.Core.Entities;
using FreeLanceHub.Core.Enums;
using FreeLanceHub.Core.Interfaces;
using FreeLanceHub.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace FreeLanceHub.Infrastructure.Services;

public class ReviewService : IReviewService
{
    private readonly ApplicationDbContext _db;

    public ReviewService(ApplicationDbContext db) => _db = db;

    // ─────────────────────────────────────────────────────────────
    // ПОЛУЧИТЬ ОТЗЫВЫ НА ПОЛЬЗОВАТЕЛЯ
    // ─────────────────────────────────────────────────────────────
    public async Task<List<ReviewDto>> GetByUserIdAsync(string userId)
    {
        return await _db.Reviews
            .Where(r => r.RevieweeId == userId)
            .Include(r => r.Reviewer)
            .Include(r => r.Order)
            .OrderByDescending(r => r.CreatedAt)
            .Select(r => new ReviewDto
            {
                Id = r.Id,
                OrderId = r.OrderId,
                OrderTitle = r.Order.Title,
                ReviewerId = r.ReviewerId,
                ReviewerName = r.Reviewer.FirstName + " " + r.Reviewer.LastName,
                ReviewerAvatar = r.Reviewer.AvatarUrl,
                RevieweeId = r.RevieweeId,
                Rating = r.Rating,
                Comment = r.Comment,
                CreatedAt = r.CreatedAt
            })
            .ToListAsync();
    }

    // ─────────────────────────────────────────────────────────────
    // ПОЛУЧИТЬ ОТЗЫВЫ ОСТАВЛЕННЫЕ ПОЛЬЗОВАТЕЛЕМ
    // ─────────────────────────────────────────────────────────────
    public async Task<List<ReviewDto>> GetByReviewerIdAsync(string reviewerId)
    {
        return await _db.Reviews
            .Where(r => r.ReviewerId == reviewerId)
            .Include(r => r.Reviewer)
            .Include(r => r.Order)
            .OrderByDescending(r => r.CreatedAt)
            .Select(r => new ReviewDto
            {
                Id = r.Id,
                OrderId = r.OrderId,
                OrderTitle = r.Order.Title,
                ReviewerId = r.ReviewerId,
                ReviewerName = r.Reviewer.FirstName + " " + r.Reviewer.LastName,
                ReviewerAvatar = r.Reviewer.AvatarUrl,
                RevieweeId = r.RevieweeId,
                Rating = r.Rating,
                Comment = r.Comment,
                CreatedAt = r.CreatedAt
            })
            .ToListAsync();
    }

    // ─────────────────────────────────────────────────────────────
    // СОЗДАТЬ ОТЗЫВ + ПЕРЕСЧЁТ РЕЙТИНГА
    // ─────────────────────────────────────────────────────────────
    public async Task<Guid> CreateAsync(string reviewerId, CreateReviewDto dto)
    {
        // 1. Проверяем что заказ существует и завершён
        var order = await _db.Orders
            .Include(o => o.Employer)
            .FirstOrDefaultAsync(o => o.Id == dto.OrderId)
            ?? throw new KeyNotFoundException("Заказ не найден");

        if (order.Status != OrderStatus.Completed)
            throw new Exception("Отзыв можно оставить только для завершённого заказа");

        // 2. Проверяем что рецензент участвовал в заказе
        bool isEmployer = order.EmployerId == reviewerId;
        bool isStudent = order.SelectedStudentId == reviewerId;

        if (!isEmployer && !isStudent)
            throw new UnauthorizedAccessException(
                "Вы не являетесь участником этого заказа");

        // 3. Проверяем что получатель — другой участник заказа
        string expectedRevieweeId = isEmployer
            ? order.SelectedStudentId!
            : order.EmployerId;

        if (dto.RevieweeId != expectedRevieweeId)
            throw new Exception("Некорректный получатель отзыва");

        // 4. Проверяем что отзыв ещё не был оставлен
        var alreadyReviewed = await _db.Reviews.AnyAsync(r =>
            r.OrderId == dto.OrderId &&
            r.ReviewerId == reviewerId);

        if (alreadyReviewed)
            throw new Exception("Вы уже оставили отзыв для этого заказа");

        // 5. Создаём отзыв
        var review = new Review
        {
            OrderId = dto.OrderId,
            ReviewerId = reviewerId,
            RevieweeId = dto.RevieweeId,
            Rating = dto.Rating,
            Comment = dto.Comment,
            CreatedAt = DateTime.UtcNow
        };

        _db.Reviews.Add(review);
        await _db.SaveChangesAsync();

        // 6. Пересчитываем рейтинг получателя отзыва
        await RecalculateRatingAsync(dto.RevieweeId);

        return review.Id;
    }

    // ─────────────────────────────────────────────────────────────
    // ПРОВЕРИТЬ ВОЗМОЖНОСТЬ ОСТАВИТЬ ОТЗЫВ
    // ─────────────────────────────────────────────────────────────
    public async Task<(bool canReview, string? targetUserId)> CanReviewAsync(
        Guid orderId, string userId)
    {
        var order = await _db.Orders.FindAsync(orderId);
        if (order == null) return (false, null);

        // Только для завершённых заказов
        if (order.Status != OrderStatus.Completed)
            return (false, null);

        // Определяем кому пишет отзыв текущий пользователь
        bool isEmployer = order.EmployerId == userId;
        bool isStudent = order.SelectedStudentId == userId;

        if (!isEmployer && !isStudent) return (false, null);

        string targetId = isEmployer
            ? order.SelectedStudentId!
            : order.EmployerId;

        // Проверяем не оставлял ли уже
        var alreadyReviewed = await _db.Reviews.AnyAsync(r =>
            r.OrderId == orderId && r.ReviewerId == userId);

        if (alreadyReviewed) return (false, null);

        return (true, targetId);
    }

    // ─────────────────────────────────────────────────────────────
    // ПРИВАТНЫЙ МЕТОД: ПЕРЕСЧЁТ РЕЙТИНГА
    // ─────────────────────────────────────────────────────────────
    private async Task RecalculateRatingAsync(string userId)
    {
        var user = await _db.Users.FindAsync(userId);
        if (user == null) return;

        // Получаем все оценки пользователя
        var ratings = await _db.Reviews
            .Where(r => r.RevieweeId == userId)
            .Select(r => (double)r.Rating)
            .ToListAsync();

        if (ratings.Count == 0)
        {
            user.Rating = 0;
            user.ReviewCount = 0;
        }
        else
        {
            // Среднее арифметическое всех оценок
            user.Rating = (decimal)Math.Round(ratings.Average(), 2);
            user.ReviewCount = ratings.Count;
        }

        await _db.SaveChangesAsync();
    }
}