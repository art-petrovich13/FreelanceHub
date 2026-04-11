namespace FreeLanceHub.Core.Entities;

/// <summary>
/// Таблица-связка many-to-many: Users ↔ Skills.
/// Хранит навыки конкретного пользователя (студента).
/// Составной первичный ключ: (UserId, SkillId) — настраивается в DbContext.
/// </summary>
public class UserSkill
{
    public string UserId { get; set; } = string.Empty;
    public Guid SkillId { get; set; }

    // Навигационные свойства
    public ApplicationUser User { get; set; } = null!;
    public Skill Skill { get; set; } = null!;
}