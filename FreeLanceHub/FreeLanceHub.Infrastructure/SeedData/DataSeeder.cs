using FreeLanceHub.Core.Entities;
using FreeLanceHub.Infrastructure.Data;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.DependencyInjection;

namespace FreeLanceHub.Infrastructure.SeedData;

/// <summary>
/// Заполняет базу данных начальными данными при первом запуске.
/// Вызывается из Program.cs после применения миграций.
/// Идемпотентен — можно запускать несколько раз без дубликатов.
/// </summary>
public static class DataSeeder
{
    public static async Task SeedAsync(IServiceProvider services)
    {
        var roleManager = services.GetRequiredService<RoleManager<IdentityRole>>();
        var userManager = services.GetRequiredService<UserManager<ApplicationUser>>();
        var db = services.GetRequiredService<ApplicationDbContext>();

        // 1. Создаём роли
        string[] roles = ["Admin", "Student", "Employer"];
        foreach (var role in roles)
        {
            if (!await roleManager.RoleExistsAsync(role))
            {
                await roleManager.CreateAsync(new IdentityRole(role));
                Console.WriteLine($"[Seeder] Роль создана: {role}");
            }
        }

        // 2. Создаём категории
        if (!db.Categories.Any())
        {
            var categories = new List<Category>
            {
                new() { Name = "Веб-разработка",          Description = "Сайты, веб-приложения, API" },
                new() { Name = "Мобильная разработка",    Description = "iOS, Android, React Native" },
                new() { Name = "Дизайн (UI/UX, графика)", Description = "Интерфейсы, логотипы, баннеры" },
                new() { Name = "Копирайтинг и контент",   Description = "Тексты, статьи, SEO" },
                new() { Name = "Математика / Физика",     Description = "Помощь с учёбой, задачи" },
                new() { Name = "Переводы",                Description = "Технические и литературные переводы" },
                new() { Name = "Видео и аудио",           Description = "Монтаж, озвучка, анимация" },
                new() { Name = "Прочее",                  Description = "Другие виды услуг" },
            };

            db.Categories.AddRange(categories);
            Console.WriteLine("[Seeder] Категории созданы");
        }

        // 3. Создаём базовые навыки
        if (!db.Skills.Any())
        {
            var skills = new List<Skill>
            {
                new() { Name = "React" },
                new() { Name = "TypeScript" },
                new() { Name = "JavaScript" },
                new() { Name = "C#" },
                new() { Name = "Python" },
                new() { Name = "Java" },
                new() { Name = "Figma" },
                new() { Name = "Photoshop" },
                new() { Name = "SQL" },
                new() { Name = "Node.js" },
                new() { Name = "Vue.js" },
                new() { Name = "Angular" },
                new() { Name = "Docker" },
                new() { Name = "Git" },
                new() { Name = "WordPress" },
                new() { Name = "Illustrator" },
            };

            db.Skills.AddRange(skills);
            Console.WriteLine("[Seeder] Навыки созданы");
        }

        // Сохраняем категории и навыки до создания пользователя
        await db.SaveChangesAsync();

        // ===== 4. Создаём администратора =====
        const string adminEmail = "admin@freelancehub.com";
        if (await userManager.FindByEmailAsync(adminEmail) == null)
        {
            var admin = new ApplicationUser
            {
                UserName = adminEmail,
                Email = adminEmail,
                FirstName = "Главный",
                LastName = "Администратор",
                EmailConfirmed = true,   // Подтверждение email не нужно для admin
                IsBlocked = false
            };

            var result = await userManager.CreateAsync(admin, "Admin@123456");
            if (result.Succeeded)
            {
                await userManager.AddToRoleAsync(admin, "Admin");
                Console.WriteLine("[Seeder] Администратор создан: admin@freelancehub.com / Admin@123456");
            }
            else
            {
                Console.WriteLine($"[Seeder] Ошибка создания admin: {string.Join(", ", result.Errors.Select(e => e.Description))}");
            }
        }
    }
}