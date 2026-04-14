namespace FreeLanceHub.Core.DTOs.Admin;

/// <summary>
/// DTO услуги для таблицы модерации в Admin-панели.
/// Включает статус и данные студента-владельца.
/// </summary>
public class AdminGigDto
{
    public Guid Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public int DeliveryDays { get; set; }
    public string Status { get; set; } = string.Empty;
    public string CategoryName { get; set; } = string.Empty;
    public string StudentId { get; set; } = string.Empty;
    public string StudentName { get; set; } = string.Empty;
    public string StudentEmail { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}