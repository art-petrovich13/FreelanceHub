using FreeLanceHub.Core.DTOs.Auth;
using FreeLanceHub.Core.Entities;
using FreeLanceHub.Core.Interfaces;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace FreeLanceHub.Infrastructure.Services;

/// <summary>
/// Реализация IAuthService.
/// Использует ASP.NET Identity для работы с пользователями
/// и генерирует JWT токены вручную.
/// </summary>
public class AuthService : IAuthService
{
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly IConfiguration _config;

    public AuthService(
        UserManager<ApplicationUser> userManager,
        IConfiguration config)
    {
        _userManager = userManager;
        _config = config;
    }

    // Регистрация
    public async Task<AuthResponseDto> RegisterAsync(RegisterDto dto)
    {
        // 1. Проверяем что email не занят
        var existing = await _userManager.FindByEmailAsync(dto.Email);
        if (existing != null)
            throw new Exception("Пользователь с таким email уже зарегистрирован");

        // 2. Создаём нового пользователя
        var user = new ApplicationUser
        {
            UserName = dto.Email,   
            Email = dto.Email,
            FirstName = dto.FirstName,
            LastName = dto.LastName,
            University = dto.University,
            Specialty = dto.Specialty,
            EmailConfirmed = true         // Без подтверждения email
        };

        // 3. Создаём пользователя с паролем (Identity хэширует пароль сам)
        var result = await _userManager.CreateAsync(user, dto.Password);
        if (!result.Succeeded)
        {
            // Собираем все ошибки в одну строку
            var errors = string.Join(", ", result.Errors.Select(e => e.Description));
            throw new Exception($"Ошибка при создании пользователя: {errors}");
        }

        // 4. Назначаем роль
        var roleResult = await _userManager.AddToRoleAsync(user, dto.Role);
        if (!roleResult.Succeeded)
        {
            // Откатываем создание пользователя если не удалось назначить роль
            await _userManager.DeleteAsync(user);
            throw new Exception("Ошибка при назначении роли");
        }

        // 5. Возвращаем токен
        return await BuildResponseAsync(user);
    }

    // Вход
    public async Task<AuthResponseDto> LoginAsync(LoginDto dto)
    {
        // 1. Находим пользователя по email
        var user = await _userManager.FindByEmailAsync(dto.Email)
            ?? throw new Exception("Неверный email или пароль");

        // 2. Проверяем пароль (Identity сравнивает хэши)
        var passwordValid = await _userManager.CheckPasswordAsync(user, dto.Password);
        if (!passwordValid)
            throw new Exception("Неверный email или пароль");

        // 3. Проверяем блокировку
        if (user.IsBlocked)
            throw new Exception("Ваш аккаунт заблокирован. Обратитесь к администратору.");

        // 4. Возвращаем токен
        return await BuildResponseAsync(user);
    }

    // Приват. методы

    /// <summary>
    /// Строит AuthResponseDto — получает роль пользователя и генерирует JWT.
    /// </summary>
    private async Task<AuthResponseDto> BuildResponseAsync(ApplicationUser user)
    {
        // Получаем роль (берём первую — у нас каждый пользователь имеет одну роль)
        var roles = await _userManager.GetRolesAsync(user);
        var role = roles.FirstOrDefault() ?? "Student";

        // Время истечения токена из конфига
        var expirationMinutes = double.Parse(
            _config["JwtSettings:ExpirationMinutes"] ?? "60");
        var expiresAt = DateTime.UtcNow.AddMinutes(expirationMinutes);

        // Генерируем JWT
        var token = GenerateJwtToken(user, role, expiresAt);

        return new AuthResponseDto
        {
            AccessToken = token,
            UserId = user.Id,
            Email = user.Email!,
            FirstName = user.FirstName,
            LastName = user.LastName,
            Role = role,
            ExpiresAt = expiresAt
        };
    }

    /// <summary>
    /// Генерирует JWT токен с Claims пользователя.
    /// Claims — это данные, зашитые в токен. Backend читает их через User.FindFirstValue().
    /// </summary>
    private string GenerateJwtToken(ApplicationUser user, string role, DateTime expiresAt)
    {
        var jwtSettings = _config.GetSection("JwtSettings");
        var secretKey = jwtSettings["SecretKey"]!;
        var issuer = jwtSettings["Issuer"]!;
        var audience = jwtSettings["Audience"]!;

        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey));
        var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        // Claims — данные внутри токена
        // Frontend может декодировать их через jwt-decode без обращения к серверу
        var claims = new[]
        {
            new Claim(ClaimTypes.NameIdentifier, user.Id),          // Уникальный ID
            new Claim(ClaimTypes.Email, user.Email!),               // Email
            new Claim(ClaimTypes.Role, role),                       // Роль (для [Authorize(Roles=...)])
            new Claim("firstName", user.FirstName),                 // Кастомный claim
            new Claim("lastName", user.LastName),                   // Кастомный claim
            new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()), // Уникальный ID токена
        };

        var token = new JwtSecurityToken(
            issuer: issuer,
            audience: audience,
            claims: claims,
            expires: expiresAt,
            signingCredentials: credentials
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}