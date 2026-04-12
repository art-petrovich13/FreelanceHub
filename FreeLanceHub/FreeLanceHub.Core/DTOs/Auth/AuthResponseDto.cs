namespace FreeLanceHub.Core.DTOs.Auth;

/// <summary>
/// DTO ответа сервера после успешной регистрации или входа.
/// Содержит JWT токен и базовые данные о пользователе.
/// Frontend сохраняет accessToken в localStorage и user-данные в Zustand.
/// </summary>
public class AuthResponseDto
{
    public string AccessToken { get; set; } = string.Empty;
    public string UserId { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string Role { get; set; } = string.Empty;
    public DateTime ExpiresAt { get; set; }
}