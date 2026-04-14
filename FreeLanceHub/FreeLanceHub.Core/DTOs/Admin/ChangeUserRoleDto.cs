using System.ComponentModel.DataAnnotations;

namespace FreeLanceHub.Core.DTOs.Admin;

/// <summary>
/// DTO для смены роли пользователя администратором.
/// </summary>
public class ChangeUserRoleDto
{
    [Required]
    [RegularExpression("^(Student|Employer|Admin)$",
        ErrorMessage = "Роль должна быть: Student, Employer или Admin")]
    public string NewRole { get; set; } = string.Empty;
}