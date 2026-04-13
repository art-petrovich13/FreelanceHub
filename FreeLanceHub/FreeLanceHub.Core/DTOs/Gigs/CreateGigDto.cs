using System.ComponentModel.DataAnnotations;

namespace FreeLanceHub.Core.DTOs.Gigs;

/// <summary>
/// DTO для создания новой услуги студентом.
/// </summary>
public class CreateGigDto
{
    [Required(ErrorMessage = "Заголовок обязателен")]
    [MaxLength(200, ErrorMessage = "Заголовок не может быть длиннее 200 символов")]
    [MinLength(10, ErrorMessage = "Заголовок должен содержать минимум 10 символов")]
    public string Title { get; set; } = string.Empty;

    [Required(ErrorMessage = "Описание обязательно")]
    [MinLength(30, ErrorMessage = "Описание должно содержать минимум 30 символов")]
    public string Description { get; set; } = string.Empty;

    [Required(ErrorMessage = "Категория обязательна")]
    public Guid CategoryId { get; set; }

    [Required(ErrorMessage = "Цена обязательна")]
    [Range(1, 1_000_000, ErrorMessage = "Цена должна быть от 1 до 1 000 000")]
    public decimal Price { get; set; }

    [Required(ErrorMessage = "Срок выполнения обязателен")]
    [Range(1, 365, ErrorMessage = "Срок выполнения от 1 до 365 дней")]
    public int DeliveryDays { get; set; }

    public List<Guid>? SkillIds { get; set; }
}