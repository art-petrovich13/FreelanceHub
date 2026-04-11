namespace FreeLanceHub.Core.Entities;

/// <summary>
/// Таблица-связка many-to-many: Gigs ↔ Skills.
/// Хранит навыки, которые демонстрирует конкретная услуга.
/// Составной первичный ключ: (GigId, SkillId) — настраивается в DbContext.
/// </summary>
public class GigSkill
{
    public Guid GigId { get; set; }
    public Guid SkillId { get; set; }

    // Навигационные свойства
    public Gig Gig { get; set; } = null!;
    public Skill Skill { get; set; } = null!;
}