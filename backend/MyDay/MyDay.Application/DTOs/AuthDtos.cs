namespace MyDay.Application.DTOs;

// ── REGISTER ─────────────────────────────────────────────
// What the user sends when creating an account
public class RegisterDto
{
    public string FirstName { get; set; } = string.Empty;  
    public string Email { get; set; } = string.Empty;      
    public string Password { get; set; } = string.Empty;   
}

// ── LOGIN ────────────────────────────────────────────────
// What the user sends when logging in
public class LoginDto
{
    public string Email { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
}

// ── AUTH RESPONSE ────────────────────────────────────────
// What the API sends BACK after successful login/register
// The token is what the frontend stores and sends with every request
public class AuthResponseDto
{
    public string Token { get; set; } = string.Empty;      // JWT token
    public string FirstName { get; set; } = string.Empty;  
    public string Email { get; set; } = string.Empty;
    public DateTime ExpiresAt { get; set; }                // When token expires
}