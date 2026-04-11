using FreeLanceHub.Core.Enums;

namespace FreeLanceHub.Core.Entities;

/// <summary>
/// Заказ работодателя (например: "Нужен лендинг, бюджет 5000₽, дедлайн 20.01").
/// Работодатель создаёт Order → студенты откликаются через Proposal →
/// Работодатель выбирает исполнителя → статус меняется на InProgress.
/// </summary>
public class Order
{
    public Guid Id { get; set; } = Guid.NewGuid();

    // FK на ApplicationUser (работодатель, создавший заказ)
    public string EmployerId { get; set; } = string.Empty;

    // FK на Category
    public Guid CategoryId { get; set; }

    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public decimal Budget { get; set; }      // Бюджет заказа
    public DateOnly Deadline { get; set; }   // Дедлайн выполнения

    // Статус жизненного цикла заказа
    public OrderStatus Status { get; set; } = OrderStatus.Open;

    // FK на ApplicationUser (выбранный исполнитель) — nullable, пустой пока не выбран
    public string? SelectedStudentId { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    // Навигационные свойства
    public ApplicationUser Employer { get; set; } = null!;
    public ApplicationUser? SelectedStudent { get; set; }
    public Category Category { get; set; } = null!;
    public ICollection<Proposal> Proposals { get; set; } = [];
    public ICollection<OrderSkill> OrderSkills { get; set; } = [];
    public ICollection<Review> Reviews { get; set; } = [];
}