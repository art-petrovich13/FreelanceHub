namespace FreeLanceHub.Core.Common;

/// <summary>
/// Базовые параметры запроса с пагинацией и поиском.
/// Наследуется специализированными классами параметров (GigQueryParams и т.д.)
/// </summary>
public class QueryParameters
{
    private int _pageSize = 12;

    public int Page { get; set; } = 1;

    public int PageSize
    {
        get => _pageSize;
        // Ограничиваем максимальный размер страницы до 50
        set => _pageSize = value > 50 ? 50 : value;
    }

    public string? Search { get; set; }
    public string? SortBy { get; set; }
}