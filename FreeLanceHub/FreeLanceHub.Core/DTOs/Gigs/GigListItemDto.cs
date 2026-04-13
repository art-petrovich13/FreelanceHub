namespace FreeLanceHub.Core.DTOs.Gigs;

/// <summary>
/// Облегчённый DTO для отображения услуги в списке.
/// Не содержит полного описания — только поля для карточки.
/// </summary>
public class GigListItemDto
{
    public Guid Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public int DeliveryDays { get; set; }
    public string CategoryName { get; set; } = string.Empty;
    public string StudentId { get; set; } = string.Empty;
    public string StudentName { get; set; } = string.Empty;
    public decimal StudentRating { get; set; }
    public string Status { get; set; } = string.Empty;
    public List<string> Skills { get; set; } = [];
    public DateTime CreatedAt { get; set; }
}