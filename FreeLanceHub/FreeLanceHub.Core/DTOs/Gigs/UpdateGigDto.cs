using System.ComponentModel.DataAnnotations;

namespace FreeLanceHub.Core.DTOs.Gigs;

/// <summary>
/// DTO для обновления существующей услуги.
/// Поля те же что и при создании.
/// </summary>
public class UpdateGigDto
{
    [Required]
    [MaxLength(200)]
    [MinLength(10)]
    public string Title { get; set; } = string.Empty;

    [Required]
    [MinLength(30)]
    public string Description { get; set; } = string.Empty;

    [Required]
    public Guid CategoryId { get; set; }

    [Required]
    [Range(1, 1_000_000)]
    public decimal Price { get; set; }

    [Required]
    [Range(1, 365)]
    public int DeliveryDays { get; set; }

    public List<Guid>? SkillIds { get; set; }
}