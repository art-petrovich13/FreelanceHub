using System.ComponentModel.DataAnnotations;

namespace FreeLanceHub.Core.DTOs.Users;

/// <summary>
/// DTO для обновления собственного профиля.
/// Пользователь может менять: имя, фамилию, bio, аватар, университет, навыки.
/// Email и пароль — через отдельные эндпоинты (не здесь).
/// </summary>
public class UpdateProfileDto
{
    [Required(ErrorMessage = "Имя обязательно")]
    [MaxLength(100)]
    public string FirstName { get; set; } = string.Empty;

    [Required(ErrorMessage = "Фамилия обязательна")]
    [MaxLength(100)]
    public string LastName { get; set; } = string.Empty;

    [MaxLength(200)]
    public string? University { get; set; }

    [MaxLength(200)]
    public string? Specialty { get; set; }

    [MaxLength(1000, ErrorMessage = "Bio не может быть длиннее 1000 символов")]
    public string? Bio { get; set; }

    [MaxLength(500)]
    [Url(ErrorMessage = "Некорректный URL аватара")]
    public string? AvatarUrl { get; set; }

    // ID навыков которые нужно установить пользователю
    // Полная замена: все старые навыки удаляются, устанавливаются новые
    public List<Guid>? SkillIds { get; set; }
}