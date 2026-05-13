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
            TargetCount = dto.TargetCount > 0 ? dto.TargetCount : 1,
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

        // Find today's log if exists
        var todayLog = habit.Logs.FirstOrDefault(l => l.CompletedDate.Date == today);

        if (todayLog != null)
        {
            // Already has a log today → increment count
            todayLog.Count++;
            await _db.SaveChangesAsync();
        }
        else
        {
            // No log today → create new log with count = 1
            var log = new HabitLog
            {
                HabitId = habitId,
                CompletedDate = DateTime.UtcNow,
                Note = dto.Note,
                Count = 1
            };
            _db.HabitLogs.Add(log);
            await _db.SaveChangesAsync();
            habit.Logs.Add(log);
        }

        // Reload updated habit
        var updated = await _db.Habits
            .Include(h => h.Logs)
            .FirstAsync(h => h.Id == habitId);

        return ToDto(updated);
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

    // ── UNDO ─────────────────────────────────────────────
    public async Task<HabitDto> UndoTodayAsync(int habitId, int userId)
    {
        var habit = await _db.Habits
            .Include(h => h.Logs)
            .FirstOrDefaultAsync(h => h.Id == habitId && h.UserId == userId);

        if (habit == null)
            throw new Exception("Habit not found.");

        var today = DateTime.UtcNow.Date;
        var todayLog = habit.Logs.FirstOrDefault(l => l.CompletedDate.Date == today);

        if (todayLog != null)
        {
            if (todayLog.Count > 1)
                todayLog.Count--; // reduce count by 1
            else
                _db.HabitLogs.Remove(todayLog); // remove log entirely

            await _db.SaveChangesAsync();
        }

        var updated = await _db.Habits
            .Include(h => h.Logs)
            .FirstAsync(h => h.Id == habitId);

        return ToDto(updated);
    }

    // ── HELPER ───────────────────────────────────────────
    private static HabitDto ToDto(Habit h)
    {
        var today = DateTime.UtcNow.Date;

        // Calculate streak
        var streak = 0;
        var checkDate = today;
        while (h.Logs.Any(l => l.CompletedDate.Date == checkDate &&
               l.Count >= h.TargetCount))
        {
            streak++;
            checkDate = checkDate.AddDays(-1);
        }

        // Today's count
        var todayLog = h.Logs.FirstOrDefault(l => l.CompletedDate.Date == today);
        var todayCount = todayLog?.Count ?? 0;

        return new HabitDto
        {
            Id = h.Id,
            Name = h.Name,
            Icon = h.Icon,
            TargetCount = h.TargetCount,
            CreatedAt = h.CreatedAt,
            CurrentStreak = streak,
            TodayCount = todayCount,
            CompletedToday = todayCount >= h.TargetCount
        };
    }
}