namespace FreeLanceHub.Core.DTOs.Admin;

/// <summary>
/// DTO пользователя для таблицы в Admin-панели.
/// Содержит все поля включая статус блокировки и роль.
/// </summary>
public class AdminUserDto
{
    public string Id { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string? University { get; set; }
    public decimal Rating { get; set; }
    public int ReviewCount { get; set; }
    public bool IsBlocked { get; set; }
    public DateTime CreatedAt { get; set; }
    public string Role { get; set; } = string.Empty;
    public int GigsCount { get; set; }
    public int OrdersCount { get; set; }
}