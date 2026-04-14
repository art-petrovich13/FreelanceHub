namespace FreeLanceHub.Core.DTOs.Notifications;

/// <summary>
/// DTO уведомления для фронтенда.
/// </summary>
public class NotificationDto
{
    public Guid Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Message { get; set; } = string.Empty;
    public bool IsRead { get; set; }
    public DateTime CreatedAt { get; set; }
}