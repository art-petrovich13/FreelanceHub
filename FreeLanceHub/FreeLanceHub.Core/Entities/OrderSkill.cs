namespace FreeLanceHub.Core.Entities;

/// <summary>
/// Таблица-связка many-to-many: Orders ↔ Skills.
/// Хранит требуемые навыки для конкретного заказа.
/// Составной первичный ключ: (OrderId, SkillId) — настраивается в DbContext.
/// </summary>
public class OrderSkill
{
    public Guid OrderId { get; set; }
    public Guid SkillId { get; set; }

    // Навигационные свойства
    public Order Order { get; set; } = null!;
    public Skill Skill { get; set; } = null!;
}