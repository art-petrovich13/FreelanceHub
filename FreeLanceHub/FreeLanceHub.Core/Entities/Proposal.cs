using FreeLanceHub.Core.Enums;

namespace FreeLanceHub.Core.Entities;

/// <summary>
/// Отклик студента на заказ.
/// Студент видит заказ → создаёт Proposal с сопроводительным письмом, ценой и сроком.
/// Работодатель просматривает все Proposal для своего Order и выбирает одного.
/// При принятии одного → остальные автоматически отклоняются.
/// </summary>
public class Proposal
{
    public Guid Id { get; set; } = Guid.NewGuid();

    // FK на Order (заказ, на который откликаются)
    public Guid OrderId { get; set; }

    // FK на ApplicationUser (студент, подавший отклик)
    public string StudentId { get; set; } = string.Empty;

    public string CoverLetter { get; set; } = string.Empty;  // Сопроводительное письмо
    public decimal ProposedPrice { get; set; }                // Предложенная цена
    public int ProposedDays { get; set; }                     // Предложенный срок (дней)

    public ProposalStatus Status { get; set; } = ProposalStatus.Pending;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // Навигационные свойства
    public Order Order { get; set; } = null!;
    public ApplicationUser Student { get; set; } = null!;
}