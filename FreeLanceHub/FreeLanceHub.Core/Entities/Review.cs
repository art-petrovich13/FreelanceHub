namespace FreeLanceHub.Core.Entities;

/// <summary>
/// Отзыв после завершённого заказа.
/// После Order.Status = Completed обе стороны могут оставить отзыв друг другу.
/// ReviewerId — тот, кто пишет отзыв.
/// RevieweeId — тот, на кого пишут отзыв.
/// Максимум 2 отзыва на один заказ (от каждой стороны).
/// </summary>
public class Review
{
    public Guid Id { get; set; } = Guid.NewGuid();

    // FK на Order (к какому заказу относится отзыв)
    public Guid OrderId { get; set; }

    // FK на ApplicationUser (кто оставил отзыв)
    public string ReviewerId { get; set; } = string.Empty;

    // FK на ApplicationUser (на кого оставлен отзыв — влияет на его рейтинг)
    public string RevieweeId { get; set; } = string.Empty;

    public int Rating { get; set; }        // Оценка от 1 до 5
    public string Comment { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // Навигационные свойства
    // ВАЖНО: два разных FK на одну таблицу → Fluent API нужен для конфигурации
    public Order Order { get; set; } = null!;
    public ApplicationUser Reviewer { get; set; } = null!;
    public ApplicationUser Reviewee { get; set; } = null!;
}