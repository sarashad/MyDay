using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using MyDay.Application.Interfaces;
using MyDay.Application.Services;
using MyDay.Infrastructure.Data;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// ── 1. DATABASE ──────────────────────────────────────────
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration
        .GetConnectionString("DefaultConnection")));

// ── 2. AUTH SERVICE ──────────────────────────────────────
// Register IAuthService → AuthService
// When a controller asks for IAuthService, ASP.NET gives it AuthService
builder.Services.AddScoped<IAuthService, AuthService>();

// ── 3. JWT AUTHENTICATION ────────────────────────────────
var jwtKey = builder.Configuration["Jwt:Key"]!;
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            ValidAudience = builder.Configuration["Jwt:Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(jwtKey))
        };
    });

// ── 4. CONTROLLERS ───────────────────────────────────────
builder.Services.AddControllers();

// ── 5. CORS ──────────────────────────────────────────────
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins("http://localhost:5173")
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

var app = builder.Build();

// ── 6. MIDDLEWARE PIPELINE ───────────────────────────────
app.UseHttpsRedirection();
app.UseCors("AllowFrontend");
app.UseAuthentication(); // ← NEW! Check JWT token
app.UseAuthorization();
app.MapControllers();

app.Run();