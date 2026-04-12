using System.ComponentModel.DataAnnotations;

namespace FreeLanceHub.Core.DTOs.Auth;

/// <summary>
/// DTO для регистрации нового пользователя.
/// Валидация через DataAnnotations — автоматически проверяется ASP.NET Core.
/// </summary>
public class RegisterDto
{
    [Required(ErrorMessage = "Email обязателен")]
    [EmailAddress(ErrorMessage = "Некорректный формат email")]
    [MaxLength(256)]
    public string Email { get; set; } = string.Empty;

    [Required(ErrorMessage = "Пароль обязателен")]
    [MinLength(6, ErrorMessage = "Пароль должен быть минимум 6 символов")]
    public string Password { get; set; } = string.Empty;

    [Required(ErrorMessage = "Имя обязательно")]
    [MaxLength(100)]
    public string FirstName { get; set; } = string.Empty;

    [Required(ErrorMessage = "Фамилия обязательна")]
    [MaxLength(100)]
    public string LastName { get; set; } = string.Empty;

    /// <summary>
    /// Роль: только "Student" или "Employer".
    /// "Admin" нельзя выбрать при регистрации — только через Admin-панель.
    /// </summary>
    [Required(ErrorMessage = "Роль обязательна")]
    [RegularExpression("^(Student|Employer)$",
        ErrorMessage = "Роль должна быть Student или Employer")]
    public string Role { get; set; } = string.Empty;

    // Необязательные поля — заполняют студенты
    [MaxLength(200)]
    public string? University { get; set; }

    [MaxLength(200)]
    public string? Specialty { get; set; }
}