namespace FreeLanceHub.Core.DTOs.Admin;

/// <summary>
/// DTO статистики платформы для дашборда Admin.
/// Виджеты: кол-во пользователей, заказов, услуг и т.д.
/// </summary>
public class PlatformStatsDto
{
    // Пользователи
    public int TotalUsers { get; set; }
    public int TotalStudents { get; set; }
    public int TotalEmployers { get; set; }
    public int BlockedUsers { get; set; }

    // Услуги
    public int TotalGigs { get; set; }
    public int ActiveGigs { get; set; }
    public int PendingGigs { get; set; }
    public int RejectedGigs { get; set; }

    // Заказы
    public int TotalOrders { get; set; }
    public int OpenOrders { get; set; }
    public int InProgressOrders { get; set; }
    public int CompletedOrders { get; set; }

    // Отклики и отзывы
    public int TotalProposals { get; set; }
    public int TotalReviews { get; set; }

    // Новые за последние 7 дней
    public int NewUsersThisWeek { get; set; }
    public int NewOrdersThisWeek { get; set; }
    public int NewGigsThisWeek { get; set; }
}