using FreeLanceHub.Core.DTOs.Reviews;

namespace FreeLanceHub.Core.Interfaces;

public interface IReviewService
{
    /// <summary>
    /// Получить все отзывы на конкретного пользователя.
    /// Используется в публичном профиле.
    /// </summary>
    Task<List<ReviewDto>> GetByUserIdAsync(string userId);

    /// <summary>
    /// Получить отзывы которые пользователь оставил другим.
    /// </summary>
    Task<List<ReviewDto>> GetByReviewerIdAsync(string reviewerId);

    /// <summary>
    /// Создать отзыв после завершённого заказа.
    /// Валидация: заказ завершён, пользователь участвовал в заказе,
    /// отзыв ещё не оставлен.
    /// Автоматически пересчитывает Rating и ReviewCount получателя.
    /// </summary>
    Task<Guid> CreateAsync(string reviewerId, CreateReviewDto dto);

    /// <summary>
    /// Проверить может ли пользователь оставить отзыв на данный заказ.
    /// Возвращает (canReview, targetUserId) — кому нужно оставить отзыв.
    /// </summary>
    Task<(bool canReview, string? targetUserId)> CanReviewAsync(
        Guid orderId, string userId);
}