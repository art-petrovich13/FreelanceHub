using FreeLanceHub.Core.DTOs.Gigs;
using FreeLanceHub.Core.DTOs.Orders;
using FreeLanceHub.Core.DTOs.Proposals;

namespace FreeLanceHub.Core.DTOs.Dashboard;

/// <summary>
/// DTO дашборда студента.
/// Содержит сводку его активности: услуги, активные заказы, поданные отклики.
/// </summary>
public class StudentDashboardDto
{
    // Сводная статистика (виджеты)
    public int TotalGigs { get; set; }
    public int ActiveGigs { get; set; }
    public int PendingGigs { get; set; }
    public int TotalProposals { get; set; }
    public int AcceptedProposals { get; set; }
    public int ActiveOrders { get; set; }   // Заказы где студент исполнитель
    public int CompletedOrders { get; set; }
    public int UnreadNotifications { get; set; }
    public decimal TotalEarned { get; set; }   // Сумма по завершённым заказам

    // Последние 5 услуг
    public List<GigListItemDto> RecentGigs { get; set; } = [];

    // Активные заказы (студент — исполнитель)
    public List<OrderListItemDto> ActiveOrdersList { get; set; } = [];

    // Последние отклики (5 штук)
    public List<ProposalDto> RecentProposals { get; set; } = [];
}