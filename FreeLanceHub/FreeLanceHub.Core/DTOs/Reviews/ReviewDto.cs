namespace FreeLanceHub.Core.DTOs.Reviews;

/// <summary>
/// DTO отзыва для отображения в профиле пользователя.
/// </summary>
public class ReviewDto
{
    public Guid Id { get; set; }
    public Guid OrderId { get; set; }
    public string OrderTitle { get; set; } = string.Empty;
    public string ReviewerId { get; set; } = string.Empty;
    public string ReviewerName { get; set; } = string.Empty;
    public string? ReviewerAvatar { get; set; }
    public string RevieweeId { get; set; } = string.Empty;
    public int Rating { get; set; }
    public string Comment { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
}