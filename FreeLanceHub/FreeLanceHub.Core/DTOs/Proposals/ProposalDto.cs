namespace FreeLanceHub.Core.DTOs.Proposals;

/// <summary>
/// DTO отклика — для отображения работодателю списка кандидатов.
/// </summary>
public class ProposalDto
{
    public Guid Id { get; set; }
    public Guid OrderId { get; set; }
    public string StudentId { get; set; } = string.Empty;
    public string StudentName { get; set; } = string.Empty;
    public string? StudentAvatar { get; set; }
    public decimal StudentRating { get; set; }
    public int StudentReviews { get; set; }
    public string? StudentUniversity { get; set; }
    public string CoverLetter { get; set; } = string.Empty;
    public decimal ProposedPrice { get; set; }
    public int ProposedDays { get; set; }
    public string Status { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
}