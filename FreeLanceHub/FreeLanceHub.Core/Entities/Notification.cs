namespace FreeLanceHub.Core.Entities;

/// <summary>
/// Уведомление пользователю (например: "Ваш отклик принят!").
/// Создаётся автоматически при ключевых событиях:
/// — принятие отклика, отклонение, завершение заказа, новый отклик и т.д.
/// </summary>
public class Notification
{
    public Guid Id { get; set; } = Guid.NewGuid();

    // FK на ApplicationUser (кому адресовано уведомление)
    public string UserId { get; set; } = string.Empty;

    public string Title { get; set; } = string.Empty;    // Короткий заголовок
    public string Message { get; set; } = string.Empty;  // Полный текст
    public bool IsRead { get; set; } = false;            // Прочитано ли
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // Навигационные свойства
    public ApplicationUser User { get; set; } = null!;
}