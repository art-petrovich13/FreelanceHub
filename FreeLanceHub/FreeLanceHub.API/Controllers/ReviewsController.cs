using FreeLanceHub.Core.DTOs.Reviews;
using FreeLanceHub.Core.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace FreeLanceHub.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ReviewsController : ControllerBase
{
    private readonly IReviewService _reviewService;

    public ReviewsController(IReviewService reviewService)
        => _reviewService = reviewService;

    // ─────────────────────────────────────────────────────────────
    /// <summary>
    /// GET /api/reviews/user/{userId}
    /// Все отзывы на конкретного пользователя (для его профиля).
    /// Публичный.
    /// </summary>
    [HttpGet("user/{userId}")]
    public async Task<IActionResult> GetByUser(string userId)
    {
        var reviews = await _reviewService.GetByUserIdAsync(userId);
        return Ok(reviews);
    }

    // ─────────────────────────────────────────────────────────────
    /// <summary>
    /// GET /api/reviews/by/{reviewerId}
    /// Отзывы которые пользователь оставил другим.
    /// </summary>
    [HttpGet("by/{reviewerId}")]
    public async Task<IActionResult> GetByReviewer(string reviewerId)
    {
        var reviews = await _reviewService.GetByReviewerIdAsync(reviewerId);
        return Ok(reviews);
    }

    // ─────────────────────────────────────────────────────────────
    /// <summary>
    /// GET /api/reviews/can/{orderId}
    /// Проверить может ли текущий пользователь оставить отзыв.
    /// Возвращает { canReview, targetUserId }.
    /// </summary>
    [HttpGet("can/{orderId:guid}")]
    [Authorize]
    public async Task<IActionResult> CanReview(Guid orderId)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)!;
        var (canReview, targetUserId) = await _reviewService.CanReviewAsync(orderId, userId);
        return Ok(new { canReview, targetUserId });
    }

    // ─────────────────────────────────────────────────────────────
    /// <summary>
    /// POST /api/reviews
    /// Создать отзыв. Только для участников завершённого заказа.
    /// Автоматически пересчитывает рейтинг получателя.
    /// </summary>
    [HttpPost]
    [Authorize]
    public async Task<IActionResult> Create([FromBody] CreateReviewDto dto)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);

        try
        {
            var reviewerId = User.FindFirstValue(ClaimTypes.NameIdentifier)!;
            var reviewId = await _reviewService.CreateAsync(reviewerId, dto);

            return CreatedAtAction(
                nameof(GetByUser),
                new { userId = dto.RevieweeId },
                new { id = reviewId, message = "Отзыв успешно опубликован" });
        }
        catch (KeyNotFoundException ex) { return NotFound(new { message = ex.Message }); }
        catch (UnauthorizedAccessException) { return Forbid(); }
        catch (Exception ex) { return BadRequest(new { message = ex.Message }); }
    }
}