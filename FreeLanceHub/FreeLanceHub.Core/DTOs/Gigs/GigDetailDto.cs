namespace FreeLanceHub.Core.DTOs.Gigs;

/// <summary>
/// Полный DTO для страницы деталей услуги.
/// Содержит всё включая описание, данные студента и навыки.
/// </summary>
public class GigDetailDto
{
    public Guid Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public int DeliveryDays { get; set; }
    public string Status { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }

    // Категория
    public Guid CategoryId { get; set; }
    public string CategoryName { get; set; } = string.Empty;

    // Студент-исполнитель
    public string StudentId { get; set; } = string.Empty;
    public string StudentName { get; set; } = string.Empty;
    public string? StudentAvatar { get; set; }
    public decimal StudentRating { get; set; }
    public int StudentReviews { get; set; }
    public string? StudentBio { get; set; }
    public string? StudentUniversity { get; set; }

    public List<SkillDto> Skills { get; set; } = [];
}

public class SkillDto
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
}