using FreeLanceHub.Core.DTOs.Common;
using FreeLanceHub.Core.DTOs.Gigs;
using FreeLanceHub.Core.Entities;
using FreeLanceHub.Core.Enums;
using FreeLanceHub.Core.Interfaces;
using FreeLanceHub.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace FreeLanceHub.Infrastructure.Services;

/// <summary>
/// Реализация IGigService.
/// Все запросы к БД — через ApplicationDbContext (EF Core).
/// </summary>
public class GigService : IGigService
{
    private readonly ApplicationDbContext _db;

    public GigService(ApplicationDbContext db)
    {
        _db = db;
    }

    // ПОЛУЧИТЬ СПИСОК
    public async Task<PagedResponseDto<GigListItemDto>> GetGigsAsync(
        int page, int pageSize, Guid? categoryId, string? search, string? sortBy)
    {
        // Базовый запрос — только активные услуги
        var query = _db.Gigs
            .Where(g => g.Status == GigStatus.Active)
            .Include(g => g.Student)
            .Include(g => g.Category)
            .Include(g => g.GigSkills)
                .ThenInclude(gs => gs.Skill)
            .AsQueryable();

        // ── Фильтры ──
        if (categoryId.HasValue)
            query = query.Where(g => g.CategoryId == categoryId.Value);

        if (!string.IsNullOrWhiteSpace(search))
        {
            var term = search.ToLower();
            query = query.Where(g =>
                g.Title.ToLower().Contains(term) ||
                g.Description.ToLower().Contains(term));
        }

        // ── Сортировка ──
        query = sortBy switch
        {
            "price_asc" => query.OrderBy(g => g.Price),
            "price_desc" => query.OrderByDescending(g => g.Price),
            "rating" => query.OrderByDescending(g => g.Student.Rating),
            "oldest" => query.OrderBy(g => g.CreatedAt),
            _ => query.OrderByDescending(g => g.CreatedAt) 
        };

        // ── Пагинация ──
        var totalCount = await query.CountAsync();
        var totalPages = (int)Math.Ceiling((double)totalCount / pageSize);

        var items = await query
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(g => new GigListItemDto
            {
                Id = g.Id,
                Title = g.Title,
                Price = g.Price,
                DeliveryDays = g.DeliveryDays,
                CategoryName = g.Category.Name,
                StudentId = g.StudentId,
                StudentName = g.Student.FirstName + " " + g.Student.LastName,
                StudentRating = g.Student.Rating,
                Status = g.Status.ToString(),
                Skills = g.GigSkills.Select(gs => gs.Skill.Name).ToList(),
                CreatedAt = g.CreatedAt
            })
            .ToListAsync();

        return new PagedResponseDto<GigListItemDto>
        {
            Items = items,
            TotalCount = totalCount,
            Page = page,
            PageSize = pageSize,
            TotalPages = totalPages,
            HasNextPage = page < totalPages,
            HasPreviousPage = page > 1
        };
    }

    // ПОЛУЧИТЬ ПО ID
    public async Task<GigDetailDto?> GetByIdAsync(Guid id)
    {
        var gig = await _db.Gigs
            .Include(g => g.Student)
            .Include(g => g.Category)
            .Include(g => g.GigSkills)
                .ThenInclude(gs => gs.Skill)
            .FirstOrDefaultAsync(g => g.Id == id);

        if (gig == null) return null;

        return new GigDetailDto
        {
            Id = gig.Id,
            Title = gig.Title,
            Description = gig.Description,
            Price = gig.Price,
            DeliveryDays = gig.DeliveryDays,
            Status = gig.Status.ToString(),
            CreatedAt = gig.CreatedAt,
            UpdatedAt = gig.UpdatedAt,
            CategoryId = gig.CategoryId,
            CategoryName = gig.Category.Name,
            StudentId = gig.StudentId,
            StudentName = gig.Student.FirstName + " " + gig.Student.LastName,
            StudentAvatar = gig.Student.AvatarUrl,
            StudentRating = gig.Student.Rating,
            StudentReviews = gig.Student.ReviewCount,
            StudentBio = gig.Student.Bio,
            StudentUniversity = gig.Student.University,
            Skills = gig.GigSkills
                .Select(gs => new SkillDto { Id = gs.SkillId, Name = gs.Skill.Name })
                .ToList()
        };
    }

    // ПОЛУЧИТЬ ПО СТУДЕНТУ
    public async Task<List<GigListItemDto>> GetByStudentIdAsync(string studentId)
    {
        return await _db.Gigs
            .Where(g => g.StudentId == studentId)
            .Include(g => g.Category)
            .Include(g => g.GigSkills).ThenInclude(gs => gs.Skill)
            .Include(g => g.Student)
            .OrderByDescending(g => g.CreatedAt)
            .Select(g => new GigListItemDto
            {
                Id = g.Id,
                Title = g.Title,
                Price = g.Price,
                DeliveryDays = g.DeliveryDays,
                CategoryName = g.Category.Name,
                StudentId = g.StudentId,
                StudentName = g.Student.FirstName + " " + g.Student.LastName,
                StudentRating = g.Student.Rating,
                Status = g.Status.ToString(),
                Skills = g.GigSkills.Select(gs => gs.Skill.Name).ToList(),
                CreatedAt = g.CreatedAt
            })
            .ToListAsync();
    }

    
    // СОЗДАТЬ
    public async Task<Guid> CreateAsync(string studentId, CreateGigDto dto)
    {
        var categoryExists = await _db.Categories.AnyAsync(c => c.Id == dto.CategoryId);
        if (!categoryExists)
            throw new Exception("Категория не найдена");

        var gig = new Gig
        {
            StudentId = studentId,
            CategoryId = dto.CategoryId,
            Title = dto.Title,
            Description = dto.Description,
            Price = dto.Price,
            DeliveryDays = dto.DeliveryDays,
            Status = GigStatus.Pending, 
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        _db.Gigs.Add(gig);

        if (dto.SkillIds != null && dto.SkillIds.Count > 0)
        {
            foreach (var skillId in dto.SkillIds.Distinct())
            {
                var skillExists = await _db.Skills.AnyAsync(s => s.Id == skillId);
                if (skillExists)
                {
                    _db.GigSkills.Add(new GigSkill
                    {
                        GigId = gig.Id,
                        SkillId = skillId
                    });
                }
            }
        }

        await _db.SaveChangesAsync();
        return gig.Id;
    }

    // ОБНОВИТЬ
    public async Task UpdateAsync(Guid id, string studentId, UpdateGigDto dto)
    {
        var gig = await _db.Gigs
            .Include(g => g.GigSkills)
            .FirstOrDefaultAsync(g => g.Id == id)
            ?? throw new KeyNotFoundException("Услуга не найдена");

        if (gig.StudentId != studentId)
            throw new UnauthorizedAccessException("Вы не можете редактировать эту услугу");

        gig.Title = dto.Title;
        gig.Description = dto.Description;
        gig.CategoryId = dto.CategoryId;
        gig.Price = dto.Price;
        gig.DeliveryDays = dto.DeliveryDays;
        gig.UpdatedAt = DateTime.UtcNow;
        gig.Status = GigStatus.Pending;

        _db.GigSkills.RemoveRange(gig.GigSkills);

        if (dto.SkillIds != null && dto.SkillIds.Count > 0)
        {
            foreach (var skillId in dto.SkillIds.Distinct())
            {
                _db.GigSkills.Add(new GigSkill
                {
                    GigId = gig.Id,
                    SkillId = skillId
                });
            }
        }

        await _db.SaveChangesAsync();
    }

    // УДАЛИТЬ / АРХИВИРОВАТЬ
    public async Task DeleteAsync(Guid id, string userId, bool isAdmin)
    {
        var gig = await _db.Gigs.FindAsync(id)
            ?? throw new KeyNotFoundException("Услуга не найдена");

        if (!isAdmin && gig.StudentId != userId)
            throw new UnauthorizedAccessException("Нет прав для удаления этой услуги");

        gig.Status = GigStatus.Archived;
        gig.UpdatedAt = DateTime.UtcNow;

        await _db.SaveChangesAsync();
    }
}