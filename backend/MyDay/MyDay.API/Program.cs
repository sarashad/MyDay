using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using MyDay.Application.Interfaces;
using MyDay.Application.Services;
using MyDay.Domain.Interfaces;
using MyDay.Infrastructure.AI;
using MyDay.Infrastructure.Data;
using Scalar.AspNetCore;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// ── 1. DATABASE ──────────────────────────────────────────
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration
        .GetConnectionString("DefaultConnection")));

// ── 2. SERVICE ───────────────────────────────────────────
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<ITodoService, TodoService>();
builder.Services.AddScoped<IHabitService, HabitService>();
builder.Services.AddScoped<IGoalService, GoalService>();

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

builder.Services.AddOpenApi();

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

// ── 6. AI ──────────────────────────────────────────────
builder.Services.AddHttpClient<IAIProvider, GeminiProvider>();
//builder.Services.AddHttpClient<IAIProvider, OpenAIProvider>();

var app = builder.Build();

// ── 7. MIDDLEWARE PIPELINE ───────────────────────────────
app.UseHttpsRedirection();
app.MapOpenApi();              
app.MapScalarApiReference();
app.UseCors("AllowFrontend");
app.UseAuthentication(); //  Check JWT token
app.UseAuthorization();
app.MapControllers();

app.Run();