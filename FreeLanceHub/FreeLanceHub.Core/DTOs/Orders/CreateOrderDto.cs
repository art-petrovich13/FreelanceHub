using System.ComponentModel.DataAnnotations;

namespace FreeLanceHub.Core.DTOs.Orders;

/// <summary>
/// DTO для создания нового заказа работодателем.
/// </summary>
public class CreateOrderDto
{
    [Required(ErrorMessage = "Заголовок обязателен")]
    [MaxLength(200, ErrorMessage = "Максимум 200 символов")]
    [MinLength(10, ErrorMessage = "Минимум 10 символов")]
    public string Title { get; set; } = string.Empty;

    [Required(ErrorMessage = "Описание обязательно")]
    [MinLength(30, ErrorMessage = "Описание должно быть не менее 30 символов")]
    public string Description { get; set; } = string.Empty;

    [Required(ErrorMessage = "Категория обязательна")]
    public Guid CategoryId { get; set; }

    [Required(ErrorMessage = "Бюджет обязателен")]
    [Range(1, 10_000_000, ErrorMessage = "Бюджет от 1 до 10 000 000")]
    public decimal Budget { get; set; }

    [Required(ErrorMessage = "Дедлайн обязателен")]
    public DateOnly Deadline { get; set; }

    public List<Guid>? SkillIds { get; set; }
}