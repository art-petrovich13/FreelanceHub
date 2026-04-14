using FreeLanceHub.Core.DTOs.Orders;

namespace FreeLanceHub.Core.DTOs.Dashboard;

/// <summary>
/// DTO дашборда работодателя.
/// Содержит сводку его активности: заказы, входящие отклики, исполнители.
/// </summary>
public class EmployerDashboardDto
{
    // Сводная статистика (виджеты)
    public int TotalOrders { get; set; }
    public int OpenOrders { get; set; }
    public int InProgressOrders { get; set; }
    public int CompletedOrders { get; set; }
    public int TotalProposalsReceived { get; set; }  // Всего откликов на все заказы
    public int PendingProposals { get; set; }     // Необработанных откликов
    public int UnreadNotifications { get; set; }
    public decimal TotalSpent { get; set; }     // Потрачено на завершённые заказы

    // Открытые заказы (активно принимают отклики)
    public List<OrderListItemDto> OpenOrdersList { get; set; } = [];

    // Заказы в работе
    public List<OrderListItemDto> InProgressOrdersList { get; set; } = [];

    // Последние 5 откликов ожидающих решения
    public List<RecentProposalWithOrderDto> RecentPendingProposals { get; set; } = [];
}

/// <summary>
/// Отклик с заголовком заказа — для виджета "Новые отклики".
/// </summary>
public class RecentProposalWithOrderDto
{
    public Guid ProposalId { get; set; }
    public string OrderTitle { get; set; } = string.Empty;
    public Guid OrderId { get; set; }
    public string StudentName { get; set; } = string.Empty;
    public decimal ProposedPrice { get; set; }
    public int ProposedDays { get; set; }
    public DateTime CreatedAt { get; set; }
}