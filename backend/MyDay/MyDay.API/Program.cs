using Microsoft.EntityFrameworkCore;
using MyDay.Infrastructure.Data;

var builder = WebApplication.CreateBuilder(args);

// ── 1. DATABASE ──────────────────────────────────────────
// Tell the app where the database is (reads from appsettings.json)
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration
        .GetConnectionString("DefaultConnection")));

// ── 2. CONTROLLERS ───────────────────────────────────────
// Enables our API controllers
builder.Services.AddControllers();

// ── 3. CORS ──────────────────────────────────────────────
// Allows our React frontend (running on port 5173) to call this API
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

// ── 4. MIDDLEWARE PIPELINE ───────────────────────────────
// The order here matters!
app.UseHttpsRedirection();  // Redirect HTTP → HTTPS
app.UseCors("AllowFrontend"); // Allow React frontend
app.UseAuthorization();     // Check if user is logged in
app.MapControllers();       // Route requests to controllers

app.Run();