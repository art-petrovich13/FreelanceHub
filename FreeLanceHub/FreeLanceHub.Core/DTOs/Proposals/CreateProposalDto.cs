using System.ComponentModel.DataAnnotations;

namespace FreeLanceHub.Core.DTOs.Proposals;

/// <summary>
/// DTO для подачи отклика студентом на заказ.
/// </summary>
public class CreateProposalDto
{
    [Required(ErrorMessage = "ID заказа обязателен")]
    public Guid OrderId { get; set; }

    [Required(ErrorMessage = "Сопроводительное письмо обязательно")]
    [MinLength(20, ErrorMessage = "Минимум 20 символов")]
    [MaxLength(2000, ErrorMessage = "Максимум 2000 символов")]
    public string CoverLetter { get; set; } = string.Empty;

    [Required(ErrorMessage = "Предложенная цена обязательна")]
    [Range(1, 10_000_000, ErrorMessage = "Цена от 1 до 10 000 000")]
    public decimal ProposedPrice { get; set; }

    [Required(ErrorMessage = "Срок обязателен")]
    [Range(1, 365, ErrorMessage = "Срок от 1 до 365 дней")]
    public int ProposedDays { get; set; }
}