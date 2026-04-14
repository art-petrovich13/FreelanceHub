using System.ComponentModel.DataAnnotations;

namespace FreeLanceHub.Core.DTOs.Reviews;

/// <summary>
/// DTO для создания отзыва после завершённого заказа.
/// </summary>
public class CreateReviewDto
{
    [Required(ErrorMessage = "ID заказа обязателен")]
    public Guid OrderId { get; set; }

    [Required(ErrorMessage = "ID получателя отзыва обязателен")]
    public string RevieweeId { get; set; } = string.Empty;

    [Required(ErrorMessage = "Оценка обязательна")]
    [Range(1, 5, ErrorMessage = "Оценка должна быть от 1 до 5")]
    public int Rating { get; set; }

    [Required(ErrorMessage = "Комментарий обязателен")]
    [MinLength(10, ErrorMessage = "Комментарий должен содержать минимум 10 символов")]
    [MaxLength(1000, ErrorMessage = "Максимум 1000 символов")]
    public string Comment { get; set; } = string.Empty;
}