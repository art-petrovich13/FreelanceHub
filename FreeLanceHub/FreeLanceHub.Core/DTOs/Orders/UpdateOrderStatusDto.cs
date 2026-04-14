using System.ComponentModel.DataAnnotations;

namespace FreeLanceHub.Core.DTOs.Orders;

/// <summary>
/// DTO для обновления статуса заказа.
/// Используется при завершении: студент сигнализирует → работодатель подтверждает.
/// </summary>
public class UpdateOrderStatusDto
{
    [Required]
    public string Action { get; set; } = string.Empty;
}