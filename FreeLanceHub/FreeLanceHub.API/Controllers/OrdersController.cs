using FreeLanceHub.Core.DTOs.Orders;
using FreeLanceHub.Core.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace FreeLanceHub.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class OrdersController : ControllerBase
{
    private readonly IOrderService _orderService;

    public OrdersController(IOrderService orderService)
        => _orderService = orderService;

    // ─────────────────────────────────────────────────────────────
    /// <summary>GET /api/orders — публичный список открытых заказов</summary>
    [HttpGet]
    public async Task<IActionResult> GetAll(
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 12,
        [FromQuery] Guid? categoryId = null,
        [FromQuery] string? search = null,
        [FromQuery] string? sortBy = null)
    {
        if (pageSize > 50) pageSize = 50;
        if (page < 1) page = 1;

        var result = await _orderService.GetOrdersAsync(page, pageSize, categoryId, search, sortBy);
        return Ok(result);
    }

    // ─────────────────────────────────────────────────────────────
    /// <summary>GET /api/orders/{id} — детали заказа</summary>
    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetById(Guid id)
    {
        var order = await _orderService.GetByIdAsync(id);
        return order == null
            ? NotFound(new { message = "Заказ не найден" })
            : Ok(order);
    }

    // ─────────────────────────────────────────────────────────────
    /// <summary>GET /api/orders/my — мои заказы (работодатель)</summary>
    [HttpGet("my")]
    [Authorize(Roles = "Employer,Admin")]
    public async Task<IActionResult> GetMy()
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)!;
        var orders = await _orderService.GetByEmployerIdAsync(userId);
        return Ok(orders);
    }

    // ─────────────────────────────────────────────────────────────
    /// <summary>GET /api/orders/active — активные заказы студента (где он исполнитель)</summary>
    [HttpGet("active")]
    [Authorize(Roles = "Student")]
    public async Task<IActionResult> GetActiveForStudent()
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)!;
        var orders = await _orderService.GetActiveForStudentAsync(userId);
        return Ok(orders);
    }

    // ─────────────────────────────────────────────────────────────
    /// <summary>POST /api/orders — создать заказ (только Employer)</summary>
    [HttpPost]
    [Authorize(Roles = "Employer")]
    public async Task<IActionResult> Create([FromBody] CreateOrderDto dto)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);

        try
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)!;
            var orderId = await _orderService.CreateAsync(userId, dto);
            return CreatedAtAction(nameof(GetById), new { id = orderId },
                new { id = orderId, message = "Заказ опубликован" });
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    // ─────────────────────────────────────────────────────────────
    /// <summary>PUT /api/orders/{id}/complete — студент завершает работу</summary>
    [HttpPut("{id:guid}/complete")]
    [Authorize(Roles = "Student")]
    public async Task<IActionResult> Complete(Guid id)
    {
        try
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)!;
            await _orderService.CompleteByStudentAsync(id, userId);
            return Ok(new { message = "Работа отмечена как выполненная" });
        }
        catch (KeyNotFoundException ex) { return NotFound(new { message = ex.Message }); }
        catch (UnauthorizedAccessException) { return Forbid(); }
        catch (Exception ex) { return BadRequest(new { message = ex.Message }); }
    }

    // ─────────────────────────────────────────────────────────────
    /// <summary>PUT /api/orders/{id}/confirm — работодатель подтверждает завершение</summary>
    [HttpPut("{id:guid}/confirm")]
    [Authorize(Roles = "Employer")]
    public async Task<IActionResult> Confirm(Guid id)
    {
        try
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)!;
            await _orderService.ConfirmCompletionAsync(id, userId);
            return Ok(new { message = "Завершение подтверждено. Не забудьте оставить отзыв!" });
        }
        catch (KeyNotFoundException ex) { return NotFound(new { message = ex.Message }); }
        catch (UnauthorizedAccessException) { return Forbid(); }
        catch (Exception ex) { return BadRequest(new { message = ex.Message }); }
    }

    // ─────────────────────────────────────────────────────────────
    /// <summary>PUT /api/orders/{id}/cancel — отменить заказ (работодатель)</summary>
    [HttpPut("{id:guid}/cancel")]
    [Authorize(Roles = "Employer,Admin")]
    public async Task<IActionResult> Cancel(Guid id)
    {
        try
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)!;
            await _orderService.CancelAsync(id, userId);
            return Ok(new { message = "Заказ отменён" });
        }
        catch (KeyNotFoundException ex) { return NotFound(new { message = ex.Message }); }
        catch (UnauthorizedAccessException) { return Forbid(); }
        catch (Exception ex) { return BadRequest(new { message = ex.Message }); }
    }
}