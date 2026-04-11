using FreeLanceHub.Core.Enums;

namespace FreeLanceHub.Core.Entities;

/// <summary>
/// Услуга студента-фрилансера (например: "Сделаю лендинг на React за 3 дня").
/// Студент создаёт Gig → Admin одобряет (Active) или отклоняет (Rejected).
/// </summary>
public class Gig
{
    public Guid Id { get; set; } = Guid.NewGuid();

    // FK на ApplicationUser (студент-исполнитель)
    // string, потому что IdentityUser.Id — это string (GUID в виде строки)
    public string StudentId { get; set; } = string.Empty;

    // FK на Category
    public Guid CategoryId { get; set; }

    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public decimal Price { get; set; }           // Цена "от"
    public int DeliveryDays { get; set; }         // Срок выполнения в днях

    // Статус: Pending → Active (одобрено) или Rejected (отклонено)
    public GigStatus Status { get; set; } = GigStatus.Pending;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    // Навигационные свойства
    public ApplicationUser Student { get; set; } = null!;
    public Category Category { get; set; } = null!;
    public ICollection<GigSkill> GigSkills { get; set; } = [];
}