using FreeLanceHub.Core.DTOs.Notifications;

namespace FreeLanceHub.Core.Interfaces;

public interface INotificationService
{
    /// <summary>
    /// Получить все уведомления пользователя (сначала непрочитанные).
    /// </summary>
    Task<List<NotificationDto>> GetAllAsync(string userId);

    /// <summary>
    /// Получить количество непрочитанных уведомлений.
    /// </summary>
    Task<int> GetUnreadCountAsync(string userId);

    /// <summary>
    /// Пометить одно уведомление как прочитанное.
    /// </summary>
    Task MarkReadAsync(Guid notificationId, string userId);

    /// <summary>
    /// Пометить все уведомления пользователя как прочитанные.
    /// </summary>
    Task MarkAllReadAsync(string userId);

    /// <summary>
    /// Удалить уведомление.
    /// </summary>
    Task DeleteAsync(Guid notificationId, string userId);

    /// <summary>
    /// Создать уведомление пользователю (используется из других сервисов).
    /// </summary>
    Task CreateAsync(string userId, string title, string message);
}