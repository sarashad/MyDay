using MyDay.Application.DTOs;

namespace MyDay.Application.Interfaces;

// This is a "contract" - it defines WHAT the auth service must do
// but not HOW it does it
// This is the Interface - the actual logic is in AuthService.cs
public interface IAuthService
{
    // Register a new user → returns token response
    Task<AuthResponseDto> RegisterAsync(RegisterDto dto);

    // Login existing user → returns token response
    Task<AuthResponseDto> LoginAsync(LoginDto dto);
}