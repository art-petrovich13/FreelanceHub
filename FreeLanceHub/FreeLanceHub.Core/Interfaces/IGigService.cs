using FreeLanceHub.Core.DTOs.Common;
using FreeLanceHub.Core.DTOs.Gigs;

namespace FreeLanceHub.Core.Interfaces;

/// <summary>
/// Интерфейс сервиса для работы с услугами (Gigs).
/// </summary>
public interface IGigService
{
    /// <summary>
    /// Получить список активных услуг с пагинацией и фильтрами.
    /// </summary>
    Task<PagedResponseDto<GigListItemDto>> GetGigsAsync(
        int page,
        int pageSize,
        Guid? categoryId,
        string? search,
        string? sortBy);

    /// <summary>
    /// Получить полную информацию об услуге по ID.
    /// Возвращает null если услуга не найдена.
    /// </summary>
    Task<GigDetailDto?> GetByIdAsync(Guid id);

    /// <summary>
    /// Получить все услуги конкретного студента (включая неактивные).
    /// Используется в профиле студента.
    /// </summary>
    Task<List<GigListItemDto>> GetByStudentIdAsync(string studentId);

    /// <summary>
    /// Создать новую услугу. Статус по умолчанию — Pending.
    /// </summary>
    /// <returns>ID созданной услуги</returns>
    Task<Guid> CreateAsync(string studentId, CreateGigDto dto);

    /// <summary>
    /// Обновить данные услуги. Только владелец может редактировать.
    /// </summary>
    Task UpdateAsync(Guid id, string studentId, UpdateGigDto dto);

    /// <summary>
    /// Удалить (архивировать) услугу.
    /// </summary>
    Task DeleteAsync(Guid id, string userId, bool isAdmin);
}