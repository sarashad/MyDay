using MyDay.Application.DTOs;
using MyDay.Application.Interfaces;
using MyDay.Domain.Entities;
using MyDay.Domain.Interfaces;
using MyDay.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace MyDay.Application.Services;

public class SparkService : ISparkService
{
    private readonly AppDbContext _db;
    private readonly IAIProvider _ai;

    public SparkService(AppDbContext db, IAIProvider ai)
    {
        _db = db;
        _ai = ai;
    }

    public async Task<SparkResponse> GetTodaySparkAsync(int userId)
    {
        var today = DateTime.UtcNow.Date;

        // Return existing spark if already generated today
        var existing = await _db.DailySparks
            .FirstOrDefaultAsync(s => s.UserId == userId && s.Date == today);

        if (existing != null)
            return MapToResponse(existing);

        // Get context for AI
        var user = await _db.Users.FindAsync(userId);
        var streak = await _db.SparkStreaks
            .FirstOrDefaultAsync(s => s.UserId == userId);
        var yesterdayTodos = await _db.Todos
            .CountAsync(t => t.UserId == userId
                && t.IsCompleted
                && t.DueDate.HasValue
                && t.DueDate.Value.Date == today.AddDays(-1));

        // Call AI
        var context = new SparkContext(
            yesterdayTodos,
            streak?.CurrentStreak ?? 0,
            user?.FirstName
        );
        var aiResult = await _ai.GenerateDailySparkAsync(context);

        // Save new spark
        var spark = new DailySpark
        {
            UserId = userId,
            TaskText = aiResult.TaskText,
            MotivationalMessage = aiResult.MotivationalMessage,
            Date = today,
            IsCompleted = false,
            CreatedAt = DateTime.UtcNow
        };

        _db.DailySparks.Add(spark);
        await _db.SaveChangesAsync();

        return MapToResponse(spark);
    }

    public async Task<SparkResponse> CompleteSparkAsync(int userId)
    {
        var today = DateTime.UtcNow.Date;

        var spark = await _db.DailySparks
            .FirstOrDefaultAsync(s => s.UserId == userId && s.Date == today)
            ?? throw new Exception("No spark found for today.");

        spark.IsCompleted = true;
        spark.CompletedAt = DateTime.UtcNow;

        await UpdateStreakAsync(userId, today);
        await AwardBadgesAsync(userId);
        await _db.SaveChangesAsync();

        return MapToResponse(spark);
    }

    public async Task<StreakResponse> GetStreakAsync(int userId)
    {
        var streak = await _db.SparkStreaks
            .FirstOrDefaultAsync(s => s.UserId == userId)
            ?? new SparkStreak { CurrentStreak = 0, LongestStreak = 0, TotalCompleted = 0 };

        var badges = await _db.SparkBadges
            .Where(b => b.UserId == userId)
            .ToListAsync();

        return new StreakResponse(
            streak.CurrentStreak,
            streak.LongestStreak,
            streak.TotalCompleted,
            streak.LastCompletedDate,
            badges.Select(b => MapBadge(b)).ToList()
        );
    }

    public async Task<List<HeatmapEntry>> GetHeatmapAsync(int userId)
    {
        var oneYearAgo = DateTime.UtcNow.Date.AddYears(-1);

        var sparks = await _db.DailySparks
            .Where(s => s.UserId == userId && s.Date >= oneYearAgo)
            .ToListAsync();

        // Fill every day of the past year
        var result = new List<HeatmapEntry>();
        for (var date = oneYearAgo; date <= DateTime.UtcNow.Date; date = date.AddDays(1))
        {
            var completed = sparks.Any(s => s.Date == date && s.IsCompleted);
            result.Add(new HeatmapEntry(date.ToString("yyyy-MM-dd"), completed));
        }

        return result;
    }

    // ── Private helpers ──────────────────────────────────────

    private async Task UpdateStreakAsync(int userId, DateTime today)
    {
        var streak = await _db.SparkStreaks
            .FirstOrDefaultAsync(s => s.UserId == userId);

        if (streak == null)
        {
            streak = new SparkStreak { UserId = userId };
            _db.SparkStreaks.Add(streak);
        }

        var yesterday = today.AddDays(-1);
        streak.CurrentStreak = streak.LastCompletedDate?.Date == yesterday
            ? streak.CurrentStreak + 1
            : 1;

        if (streak.CurrentStreak > streak.LongestStreak)
            streak.LongestStreak = streak.CurrentStreak;

        streak.TotalCompleted++;
        streak.LastCompletedDate = today;
    }

    private async Task AwardBadgesAsync(int userId)
    {
        var streak = await _db.SparkStreaks
            .FirstOrDefaultAsync(s => s.UserId == userId);
        if (streak == null) return;

        var earned = await _db.SparkBadges
            .Where(b => b.UserId == userId)
            .Select(b => b.BadgeKey)
            .ToListAsync();

        var toAward = new List<(string key, int threshold)>
        {
            ("first_spark",   1),
            ("streak_3",      3),
            ("week_warrior",  7),
            ("month_master",  30),
            ("centurion",     100)
        };

        foreach (var (key, threshold) in toAward)
        {
            if (!earned.Contains(key) && streak.TotalCompleted >= threshold)
            {
                _db.SparkBadges.Add(new SparkBadge
                {
                    UserId = userId,
                    BadgeKey = key,
                    EarnedAt = DateTime.UtcNow
                });
            }
        }
    }

    private static SparkResponse MapToResponse(DailySpark s) =>
        new(s.Id, s.TaskText, s.MotivationalMessage, s.Date, s.IsCompleted, s.CompletedAt);

    private static BadgeResponse MapBadge(SparkBadge b)
    {
        var info = BadgeInfo.Get(b.BadgeKey);
        return new BadgeResponse(b.BadgeKey, info.Name, info.Icon, info.Description, b.EarnedAt);
    }
}

// Badge metadata
file static class BadgeInfo
{
    public record Info(string Name, string Icon, string Description);

    private static readonly Dictionary<string, Info> _map = new()
    {
        ["first_spark"] = new("First Spark", "🔥", "Completed your first Daily Spark!"),
        ["streak_3"] = new("3-Day Streak", "⚡", "3 days in a row!"),
        ["week_warrior"] = new("Week Warrior", "🌟", "7 days in a row!"),
        ["month_master"] = new("Month Master", "💎", "30 days in a row!"),
        ["centurion"] = new("Centurion", "🏆", "100 days completed!")
    };

    public static Info Get(string key) =>
        _map.TryGetValue(key, out var info) ? info : new(key, "🎖️", "");
}