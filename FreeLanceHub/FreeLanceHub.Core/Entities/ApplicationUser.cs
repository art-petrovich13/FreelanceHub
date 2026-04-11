using Microsoft.AspNetCore.Identity;

namespace FreeLanceHub.Core.Entities;

/// <summary>
/// Расширенный пользователь — наследуется от IdentityUser (ASP.NET Identity).
/// IdentityUser уже содержит: Id (string/UUID), Email, PasswordHash, UserName и т.д.
/// Мы добавляем свои поля специфичные для FreeLanceHub.
/// </summary>
public class ApplicationUser : IdentityUser
{
    // Личные данные 
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;

    // Данные студента (необязательные) 
    public string? University { get; set; }
    public string? Specialty { get; set; }

    // Профиль 
    public string? Bio { get; set; }
    public string? AvatarUrl { get; set; }

    // Рейтинг 
    public decimal Rating { get; set; } = 0;
    public int ReviewCount { get; set; } = 0;

    // Статус аккаунта 
    public bool IsBlocked { get; set; } = false;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // Навигационные свойства (EF Core использует их для JOIN-запросов) 
    public ICollection<Gig> Gigs { get; set; } = [];
    public ICollection<Order> Orders { get; set; } = [];
    public ICollection<Proposal> Proposals { get; set; } = [];
    public ICollection<UserSkill> UserSkills { get; set; } = [];
    public ICollection<Notification> Notifications { get; set; } = [];
}