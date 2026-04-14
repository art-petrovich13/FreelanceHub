namespace FreeLanceHub.Core.DTOs.Users;

/// <summary>
/// Полный DTO профиля пользователя.
/// Используется для страницы /profile/{id} — публичный просмотр.
/// Содержит все публичные поля: рейтинг, навыки, список услуг (ID).
/// </summary>
public class UserProfileDto
{
    public string Id { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string? University { get; set; }
    public string? Specialty { get; set; }
    public string? Bio { get; set; }
    public string? AvatarUrl { get; set; }
    public decimal Rating { get; set; }
    public int ReviewCount { get; set; }
    public bool IsBlocked { get; set; }
    public DateTime CreatedAt { get; set; }
    public string Role { get; set; } = string.Empty;

    // Навыки пользователя (теги)
    public List<UserSkillDto> Skills { get; set; } = [];
}

public class UserSkillDto
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
}