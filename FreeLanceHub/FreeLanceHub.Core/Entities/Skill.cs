namespace FreeLanceHub.Core.Entities;

/// <summary>
/// Навык/тег (например: "React", "Python", "Figma").
/// Используется в профилях пользователей, услугах и заказах.
/// </summary>
public class Skill
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string Name { get; set; } = string.Empty;

    // Навигационные свойства
    public ICollection<UserSkill> UserSkills { get; set; } = [];
    public ICollection<GigSkill> GigSkills { get; set; } = [];
    public ICollection<OrderSkill> OrderSkills { get; set; } = [];
}