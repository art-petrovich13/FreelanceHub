namespace FreeLanceHub.Core.DTOs.Common;

/// <summary>
/// Универсальный DTO ответа с пагинацией.
/// Используется во всех эндпоинтах возвращающих списки.
/// T — тип элемента списка (GigListItemDto, OrderListItemDto и т.д.)
/// </summary>
public class PagedResponseDto<T>
{
    public List<T> Items { get; set; } = [];
    public int TotalCount { get; set; }
    public int Page { get; set; }
    public int PageSize { get; set; }
    public int TotalPages { get; set; }
    public bool HasNextPage { get; set; }
    public bool HasPreviousPage { get; set; }
}