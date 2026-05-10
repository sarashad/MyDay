using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using MyDay.Application.DTOs;
using MyDay.Application.Interfaces;
using MyDay.Domain.Entities;
using MyDay.Infrastructure.Data;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.EntityFrameworkCore;

namespace MyDay.Application.Services;

// This class does the actual work of register and login
public class AuthService : IAuthService
{
    private readonly AppDbContext _db;           // To access the database
    private readonly IConfiguration _config;    // To read appsettings.json (JWT settings)

    public AuthService(AppDbContext db, IConfiguration config)
    {
        _db = db;
        _config = config;
    }

    // ── REGISTER ─────────────────────────────────────────
    public async Task<AuthResponseDto> RegisterAsync(RegisterDto dto)
    {
        // 1. Check if email already exists
        var exists = await _db.Users.AnyAsync(u => u.Email == dto.Email);
        if (exists)
            throw new Exception("Email already in use.");

        // 2. Create new user with hashed password
        // BCrypt.HashPassword → converts "MyPassword123" to something like "$2a$11$xyz..."
        // Even we can't read it back — it's one-way encryption!
        var user = new User
        {
            FirstName = dto.FirstName,
            Email = dto.Email,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password)
        };

        // 3. Save to database
        _db.Users.Add(user);
        await _db.SaveChangesAsync();

        // 4. Generate and return JWT token
        return GenerateToken(user);
    }

    // ── LOGIN ────────────────────────────────────────────
    public async Task<AuthResponseDto> LoginAsync(LoginDto dto)
    {
        // 1. Find user by email
        var user = await _db.Users.FirstOrDefaultAsync(u => u.Email == dto.Email);
        if (user == null)
            throw new Exception("Invalid email or password.");

        // 2. Check password
        // BCrypt.Verify → compares the plain password with the stored hash
        var valid = BCrypt.Net.BCrypt.Verify(dto.Password, user.PasswordHash);
        if (!valid)
            throw new Exception("Invalid email or password.");

        // 3. Generate and return JWT token
        return GenerateToken(user);
    }

    // ── GENERATE JWT TOKEN ───────────────────────────────
    private AuthResponseDto GenerateToken(User user)
    {
        // Read JWT settings from appsettings.json
        var key = _config["Jwt:Key"]!;
        var issuer = _config["Jwt:Issuer"]!;
        var audience = _config["Jwt:Audience"]!;
        var expiryDays = int.Parse(_config["Jwt:ExpiryInDays"]!);

        var expiresAt = DateTime.UtcNow.AddDays(expiryDays);

        // Claims = information stored inside the token
        // Like a "badge" that contains: who are you, what is your email
        var claims = new[]
        {
            new Claim(JwtRegisteredClaimNames.Sub, user.Id.ToString()),  // User ID
            new Claim(JwtRegisteredClaimNames.Email, user.Email),         // Email
            new Claim(JwtRegisteredClaimNames.GivenName, user.FirstName), // First name
            new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()) // Unique token ID
        };

        // Sign the token with our secret key
        var signingKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(key));
        var credentials = new SigningCredentials(signingKey, SecurityAlgorithms.HmacSha256);

        // Build the token
        var token = new JwtSecurityToken(
            issuer: issuer,
            audience: audience,
            claims: claims,
            expires: expiresAt,
            signingCredentials: credentials
        );

        // Return the response
        return new AuthResponseDto
        {
            Token = new JwtSecurityTokenHandler().WriteToken(token),
            FirstName = user.FirstName,
            Email = user.Email,
            ExpiresAt = expiresAt
        };
    }
}