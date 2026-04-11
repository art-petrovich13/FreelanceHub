using FreeLanceHub.Core.Entities;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace FreeLanceHub.Infrastructure.Data;

/// <summary>
/// Главный DbContext приложения.
/// Наследуется от IdentityDbContext<ApplicationUser> — это автоматически создаёт
/// таблицы ASP.NET Identity: AspNetUsers, AspNetRoles, AspNetUserRoles и т.д.
/// </summary>
public class ApplicationDbContext : IdentityDbContext<ApplicationUser>
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options) { }

    // DbSet для каждой нашей таблицы
    // Синтаксис "=> Set<T>()" — это выражение-свойство (expression-bodied property)
    public DbSet<Gig> Gigs => Set<Gig>();
    public DbSet<Order> Orders => Set<Order>();
    public DbSet<Proposal> Proposals => Set<Proposal>();
    public DbSet<Review> Reviews => Set<Review>();
    public DbSet<Category> Categories => Set<Category>();
    public DbSet<Skill> Skills => Set<Skill>();
    public DbSet<UserSkill> UserSkills => Set<UserSkill>();
    public DbSet<GigSkill> GigSkills => Set<GigSkill>();
    public DbSet<OrderSkill> OrderSkills => Set<OrderSkill>();
    public DbSet<Notification> Notifications => Set<Notification>();

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);

        // Составные первичные ключи для join-таблиц 
        // EF Core не умеет угадать составной PK сам — нужно указать явно

        builder.Entity<UserSkill>()
            .HasKey(us => new { us.UserId, us.SkillId });

        builder.Entity<GigSkill>()
            .HasKey(gs => new { gs.GigId, gs.SkillId });

        builder.Entity<OrderSkill>()
            .HasKey(os => new { os.OrderId, os.SkillId });

        // Настройка Order: nullable FK на SelectedStudent 
        // Один заказ может иметь 0 или 1 выбранного исполнителя
        builder.Entity<Order>()
            .HasOne(o => o.SelectedStudent)
            .WithMany()
            .HasForeignKey(o => o.SelectedStudentId)
            .IsRequired(false)  // nullable — разрешаем NULL
            .OnDelete(DeleteBehavior.SetNull); // при удалении пользователя → NULL

        // Настройка Order: FK на Employer 
        builder.Entity<Order>()
            .HasOne(o => o.Employer)
            .WithMany(u => u.Orders)
            .HasForeignKey(o => o.EmployerId)
            .OnDelete(DeleteBehavior.Restrict); // запрещаем каскадное удаление

        // Настройка Review: два разных FK на таблицу Users 
        // EF Core не может автоматически разрешить конфликт — настраиваем вручную

        builder.Entity<Review>()
            .HasOne(r => r.Reviewer)  // Кто пишет отзыв
            .WithMany()
            .HasForeignKey(r => r.ReviewerId)
            .OnDelete(DeleteBehavior.Restrict); // не удалять отзывы при удалении пользователя

        builder.Entity<Review>()
            .HasOne(r => r.Reviewee)  // На кого пишут отзыв
            .WithMany()
            .HasForeignKey(r => r.RevieweeId)
            .OnDelete(DeleteBehavior.Restrict);

        // Настройка Gig: FK на Student 
        builder.Entity<Gig>()
            .HasOne(g => g.Student)
            .WithMany(u => u.Gigs)
            .HasForeignKey(g => g.StudentId)
            .OnDelete(DeleteBehavior.Cascade); // при удалении студента → удаляем его услуги

        // Точность для decimal полей 
        // PostgreSQL требует явного указания precision для decimal
        builder.Entity<Gig>()
            .Property(g => g.Price)
            .HasPrecision(10, 2);

        builder.Entity<Order>()
            .Property(o => o.Budget)
            .HasPrecision(10, 2);

        builder.Entity<Proposal>()
            .Property(p => p.ProposedPrice)
            .HasPrecision(10, 2);

        builder.Entity<ApplicationUser>()
            .Property(u => u.Rating)
            .HasPrecision(3, 2);

        // Индексы для ускорения поиска 
        builder.Entity<Gig>()
            .HasIndex(g => g.StudentId);

        builder.Entity<Gig>()
            .HasIndex(g => g.CategoryId);

        builder.Entity<Gig>()
            .HasIndex(g => g.Status);

        builder.Entity<Order>()
            .HasIndex(o => o.EmployerId);

        builder.Entity<Order>()
            .HasIndex(o => o.Status);

        builder.Entity<Proposal>()
            .HasIndex(p => new { p.OrderId, p.StudentId })
            .IsUnique(); // Студент может подать только 1 отклик на 1 заказ

        builder.Entity<Notification>()
            .HasIndex(n => new { n.UserId, n.IsRead });
    }
}