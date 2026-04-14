using FreeLanceHub.Core.DTOs.Proposals;
using FreeLanceHub.Core.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace FreeLanceHub.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ProposalsController : ControllerBase
{
    private readonly IProposalService _proposalService;

    public ProposalsController(IProposalService proposalService)
        => _proposalService = proposalService;

    // ─────────────────────────────────────────────────────────────
    /// <summary>
    /// GET /api/proposals/order/{orderId}
    /// Список откликов на конкретный заказ. Только для владельца заказа.
    /// </summary>
    [HttpGet("order/{orderId:guid}")]
    [Authorize(Roles = "Employer,Admin")]
    public async Task<IActionResult> GetByOrder(Guid orderId)
    {
        try
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)!;
            var proposals = await _proposalService.GetByOrderIdAsync(orderId, userId);
            return Ok(proposals);
        }
        catch (KeyNotFoundException ex) { return NotFound(new { message = ex.Message }); }
        catch (UnauthorizedAccessException) { return Forbid(); }
    }

    // ─────────────────────────────────────────────────────────────
    /// <summary>
    /// GET /api/proposals/my
    /// Мои отклики (для студента — список заказов на которые откликнулся).
    /// </summary>
    [HttpGet("my")]
    [Authorize(Roles = "Student")]
    public async Task<IActionResult> GetMy()
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)!;
        var proposals = await _proposalService.GetByStudentIdAsync(userId);
        return Ok(proposals);
    }

    // ─────────────────────────────────────────────────────────────
    /// <summary>
    /// POST /api/proposals
    /// Подать отклик на заказ. Только для студентов.
    /// </summary>
    [HttpPost]
    [Authorize(Roles = "Student")]
    public async Task<IActionResult> Create([FromBody] CreateProposalDto dto)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);

        try
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)!;
            var proposalId = await _proposalService.CreateAsync(userId, dto);
            return CreatedAtAction(nameof(GetMy), new { },
                new { id = proposalId, message = "Отклик успешно подан" });
        }
        catch (KeyNotFoundException ex) { return NotFound(new { message = ex.Message }); }
        catch (Exception ex) { return BadRequest(new { message = ex.Message }); }
    }

    // ─────────────────────────────────────────────────────────────
    /// <summary>
    /// PUT /api/proposals/{id}/accept
    /// Принять отклик. Только работодатель-владелец заказа.
    /// </summary>
    [HttpPut("{id:guid}/accept")]
    [Authorize(Roles = "Employer")]
    public async Task<IActionResult> Accept(Guid id)
    {
        try
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)!;
            await _proposalService.AcceptAsync(id, userId);
            return Ok(new { message = "Исполнитель выбран. Заказ переведён в статус «В работе»." });
        }
        catch (KeyNotFoundException ex) { return NotFound(new { message = ex.Message }); }
        catch (UnauthorizedAccessException) { return Forbid(); }
        catch (Exception ex) { return BadRequest(new { message = ex.Message }); }
    }

    // ─────────────────────────────────────────────────────────────
    /// <summary>
    /// PUT /api/proposals/{id}/reject
    /// Отклонить конкретный отклик. Только работодатель.
    /// </summary>
    [HttpPut("{id:guid}/reject")]
    [Authorize(Roles = "Employer")]
    public async Task<IActionResult> Reject(Guid id)
    {
        try
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)!;
            await _proposalService.RejectAsync(id, userId);
            return Ok(new { message = "Отклик отклонён" });
        }
        catch (KeyNotFoundException ex) { return NotFound(new { message = ex.Message }); }
        catch (UnauthorizedAccessException) { return Forbid(); }
        catch (Exception ex) { return BadRequest(new { message = ex.Message }); }
    }
}