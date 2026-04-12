using FreeLanceHub.Core.DTOs.Auth;

namespace FreeLanceHub.Core.Interfaces;

/// <summary>
/// Интерфейс сервиса аутентификации.
/// Определяет контракт — реализация находится в Infrastructure.
/// Такое разделение позволяет легко подменить реализацию (например, для тестов).
/// </summary>
public interface IAuthService
{
    /// <summary>
    /// Регистрация нового пользователя.
    /// Бросает Exception если email уже занят или пароль не соответствует требованиям.
    /// </summary>
    Task<AuthResponseDto> RegisterAsync(RegisterDto dto);

    /// <summary>
    /// Вход в систему — проверка email + пароля, возврат JWT токена.
    /// Бросает Exception если credentials неверны или аккаунт заблокирован.
    /// </summary>
    Task<AuthResponseDto> LoginAsync(LoginDto dto);
}