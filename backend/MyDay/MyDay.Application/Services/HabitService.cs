using Microsoft.EntityFrameworkCore;
using MyDay.Application.DTOs;
using MyDay.Application.Interfaces;
using MyDay.Domain.Entities;
using MyDay.Infrastructure.Data;

namespace MyDay.Application.Services;

public class HabitService : IHabitService
{
    private readonly AppDbContext _db;

    public HabitService(AppDbContext db)
    {
        _db = db;
    }

    // ── GET ALL ──────────────────────────────────────────
    public async Task<List<HabitDto>> GetAllAsync(int userId)
    {
        var habits = await _db.Habits
            .Where(h => h.UserId == userId)
            .Include(h => h.Logs) // Load logs too
            .OrderBy(h => h.CreatedAt)
            .ToListAsync();

        return habits.Select(h => ToDto(h)).ToList();
    }

    // ── CREATE ───────────────────────────────────────────
    public async Task<HabitDto> CreateAsync(CreateHabitDto dto, int userId)
    {
        var habit = new Habit
        {
            Name = dto.Name,
            Icon = dto.Icon,
            UserId = userId
        };

        _db.Habits.Add(habit);
        await _db.SaveChangesAsync();

        return ToDto(habit);
    }

    // ── LOG TODAY ────────────────────────────────────────
    // Mark habit as done for today
    public async Task<HabitDto> LogTodayAsync(int habitId, CreateHabitLogDto dto, int userId)
    {
        var habit = await _db.Habits
            .Include(h => h.Logs)
            .FirstOrDefaultAsync(h => h.Id == habitId && h.UserId == userId);

        if (habit == null)
            throw new Exception("Habit not found.");

        var today = DateTime.UtcNow.Date;

        // Check if already logged today
        var alreadyLogged = habit.Logs.Any(l => l.CompletedDate.Date == today);
        if (alreadyLogged)
            throw new Exception("Habit already logged for today.");

        var log = new HabitLog
        {
            HabitId = habitId,
            CompletedDate = DateTime.UtcNow,
            Note = dto.Note
        };

        _db.HabitLogs.Add(log);
        await _db.SaveChangesAsync();

        // Reload habit with updated logs
        habit.Logs.Add(log);
        return ToDto(habit);
    }

    // ── DELETE ───────────────────────────────────────────
    public async Task DeleteAsync(int id, int userId)
    {
        var habit = await _db.Habits
            .FirstOrDefaultAsync(h => h.Id == id && h.UserId == userId);

        if (habit == null)
            throw new Exception("Habit not found.");

        _db.Habits.Remove(habit);
        await _db.SaveChangesAsync();
    }

    // ── HELPER ───────────────────────────────────────────
    private static HabitDto ToDto(Habit h)
    {
        var today = DateTime.UtcNow.Date;

        // Calculate streak — how many consecutive days completed
        var streak = 0;
        var checkDate = today;
        while (h.Logs.Any(l => l.CompletedDate.Date == checkDate))
        {
            streak++;
            checkDate = checkDate.AddDays(-1);
        }

        return new HabitDto
        {
            Id = h.Id,
            Name = h.Name,
            Icon = h.Icon,
            CreatedAt = h.CreatedAt,
            CurrentStreak = streak,
            CompletedToday = h.Logs.Any(l => l.CompletedDate.Date == today)
        };
    }
}