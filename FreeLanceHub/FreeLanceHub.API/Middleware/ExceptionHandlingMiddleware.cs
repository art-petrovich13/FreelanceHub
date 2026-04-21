using FreeLanceHub.Core.DTOs.Common;
using System.Net;
using System.Text.Json;

namespace FreeLanceHub.API.Middleware;

/// <summary>
/// Глобальный обработчик исключений.
/// Перехватывает все необработанные исключения и возвращает
/// стандартизированный JSON-ответ с корректным HTTP статусом.
///
/// Подключается в Program.cs как ПЕРВЫЙ middleware в pipeline.
/// </summary>
public class ExceptionHandlingMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<ExceptionHandlingMiddleware> _logger;

    public ExceptionHandlingMiddleware(
        RequestDelegate next,
        ILogger<ExceptionHandlingMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }

    public async Task Invoke(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (Exception ex)
        {
            await HandleExceptionAsync(context, ex);
        }
    }

    private async Task HandleExceptionAsync(HttpContext context, Exception ex)
    {
        // Определяем HTTP статус по типу исключения
        var (statusCode, userMessage) = ex switch
        {
            KeyNotFoundException => (HttpStatusCode.NotFound, ex.Message),
            UnauthorizedAccessException => (HttpStatusCode.Forbidden, ex.Message),
            ArgumentException => (HttpStatusCode.BadRequest, ex.Message),
            InvalidOperationException => (HttpStatusCode.BadRequest, ex.Message),
            // Все остальные — 400 с сообщением (не 500, чтобы не пугать пользователя)
            _ => (HttpStatusCode.BadRequest, ex.Message),
        };

        // Логируем полную информацию об ошибке (с StackTrace)
        // 500-е ошибки логируем как Error, остальные как Warning
        if ((int)statusCode >= 500)
            _logger.LogError(ex, "Unhandled exception: {Message}", ex.Message);
        else
            _logger.LogWarning("Handled exception [{Status}]: {Message}", statusCode, ex.Message);

        // Формируем стандартный ответ
        var response = new ErrorResponseDto
        {
            StatusCode = (int)statusCode,
            Message = userMessage,
            // В dev-режиме показываем StackTrace для отладки
            Detail = context.RequestServices
                .GetRequiredService<IWebHostEnvironment>()
                .IsDevelopment() ? ex.StackTrace : null
        };

        context.Response.ContentType = "application/json";
        context.Response.StatusCode = (int)statusCode;

        var json = JsonSerializer.Serialize(response, new JsonSerializerOptions
        {
            PropertyNamingPolicy = JsonNamingPolicy.CamelCase
        });

        await context.Response.WriteAsync(json);
    }
}