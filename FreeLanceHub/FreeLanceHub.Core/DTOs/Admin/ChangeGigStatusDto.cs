using System.ComponentModel.DataAnnotations;

namespace FreeLanceHub.Core.DTOs.Admin;

/// <summary>
/// DTO для смены статуса услуги администратором.
/// Action: "approve" → Active, "reject" → Rejected, "archive" → Archived
/// </summary>
public class ChangeGigStatusDto
{
    [Required]
    [RegularExpression("^(approve|reject|archive)$",
        ErrorMessage = "Action должен быть: approve, reject или archive")]
    public string Action { get; set; } = string.Empty;

    // Необязательный комментарий при отклонении
    public string? Reason { get; set; }
}