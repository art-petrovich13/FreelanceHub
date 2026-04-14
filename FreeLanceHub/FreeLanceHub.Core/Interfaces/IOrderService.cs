using FreeLanceHub.Core.DTOs.Common;
using FreeLanceHub.Core.DTOs.Orders;

namespace FreeLanceHub.Core.Interfaces;

public interface IOrderService
{
    /// <summary>
    /// Список открытых заказов с пагинацией и фильтрами.
    /// </summary>
    Task<PagedResponseDto<OrderListItemDto>> GetOrdersAsync(
        int page,
        int pageSize,
        Guid? categoryId,
        string? search,
        string? sortBy);

    /// <summary>
    /// Полная информация о заказе по ID.
    /// </summary>
    Task<OrderDetailDto?> GetByIdAsync(Guid id);

    /// <summary>
    /// Заказы конкретного работодателя (его личный кабинет).
    /// </summary>
    Task<List<OrderListItemDto>> GetByEmployerIdAsync(string employerId);

    /// <summary>
    /// Заказы, в которых студент является выбранным исполнителем.
    /// </summary>
    Task<List<OrderListItemDto>> GetActiveForStudentAsync(string studentId);

    /// <summary>
    /// Создать новый заказ. Сразу переходит в статус Open.
    /// </summary>
    Task<Guid> CreateAsync(string employerId, CreateOrderDto dto);

    /// <summary>
    /// Завершить заказ — вызывает студент когда работа выполнена.
    /// Order.Status → Completed (если работодатель уже подтвердил) или ждёт подтверждения.
    /// </summary>
    Task CompleteByStudentAsync(Guid orderId, string studentId);

    /// <summary>
    /// Подтвердить завершение — вызывает работодатель.
    /// Order.Status → Completed.
    /// </summary>
    Task ConfirmCompletionAsync(Guid orderId, string employerId);

    /// <summary>
    /// Отменить заказ — только работодатель, только если статус Open или InProgress.
    /// </summary>
    Task CancelAsync(Guid orderId, string employerId);
}