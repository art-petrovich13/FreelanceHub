namespace FreeLanceHub.Core.DTOs.Orders;

/// <summary>
/// Облегчённый DTO для отображения заказа в списке.
/// </summary>
public class OrderListItemDto
{
    public Guid Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public decimal Budget { get; set; }
    public DateOnly Deadline { get; set; }
    public string CategoryName { get; set; } = string.Empty;
    public string EmployerId { get; set; } = string.Empty;
    public string EmployerName { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public int ProposalCount { get; set; }
    public List<string> Skills { get; set; } = [];
    public DateTime CreatedAt { get; set; }
}