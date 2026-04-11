namespace FreeLanceHub.Core.Entities;

/// <summary>
/// Категория услуг и заказов (например: "Веб-разработка", "Дизайн").
/// Заполняется через DataSeeder при первом запуске.
/// </summary>
public class Category
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string? IconUrl { get; set; }

    // Навигационные свойства
    public ICollection<Gig> Gigs { get; set; } = [];
    public ICollection<Order> Orders { get; set; } = [];
}