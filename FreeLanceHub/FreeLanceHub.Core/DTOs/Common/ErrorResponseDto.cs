namespace FreeLanceHub.Core.DTOs.Common;

/// <summary>
/// Стандартный формат ответа при ошибке.
/// Используется ExceptionHandlingMiddleware для всех необработанных исключений.
/// Frontend знает что ошибка всегда выглядит так:
/// { "statusCode": 400, "message": "...", "detail": null }
/// </summary>
public class ErrorResponseDto
{
    public int StatusCode { get; set; }
    public string Message { get; set; } = string.Empty;
    public string? Detail { get; set; }  // StackTrace только в Development
}