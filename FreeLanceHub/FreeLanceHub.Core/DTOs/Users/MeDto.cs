namespace FreeLanceHub.Core.DTOs.Users;

/// <summary>
/// DTO текущего авторизованного пользователя.
/// Используется в GET /api/users/me — расширенная версия /auth/me.
/// Содержит навыки и все данные профиля.
/// </summary>
public class MeDto
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
    public string Role { get; set; } = string.Empty;
    public List<UserSkillDto> Skills { get; set; } = [];
}