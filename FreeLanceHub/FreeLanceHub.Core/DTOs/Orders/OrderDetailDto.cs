namespace FreeLanceHub.Core.DTOs.Orders;

/// <summary>
/// Полный DTO для страницы деталей заказа.
/// Содержит описание, данные работодателя, выбранного студента и список откликов.
/// </summary>
public class OrderDetailDto
{
    public Guid Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public decimal Budget { get; set; }
    public DateOnly Deadline { get; set; }
    public string Status { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }

    // Категория
    public Guid CategoryId { get; set; }
    public string CategoryName { get; set; } = string.Empty;

    // Работодатель
    public string EmployerId { get; set; } = string.Empty;
    public string EmployerName { get; set; } = string.Empty;
    public string? EmployerAvatar { get; set; }

    // Выбранный исполнитель 
    public string? SelectedStudentId { get; set; }
    public string? SelectedStudentName { get; set; }

    public List<OrderSkillDto> Skills { get; set; } = [];

    public int ProposalCount { get; set; }
}

public class OrderSkillDto
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
}