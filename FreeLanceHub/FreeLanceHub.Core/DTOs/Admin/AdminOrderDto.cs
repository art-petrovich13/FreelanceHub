namespace FreeLanceHub.Core.DTOs.Admin;

/// <summary>
/// DTO заказа для таблицы в Admin-панели.
/// Включает все статусы и участников.
/// </summary>
public class AdminOrderDto
{
    public Guid Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public decimal Budget { get; set; }
    public string Status { get; set; } = string.Empty;
    public string CategoryName { get; set; } = string.Empty;
    public string EmployerId { get; set; } = string.Empty;
    public string EmployerName { get; set; } = string.Empty;
    public string EmployerEmail { get; set; } = string.Empty;
    public string? SelectedStudentName { get; set; }
    public int ProposalCount { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateOnly Deadline { get; set; }
}