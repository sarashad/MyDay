namespace MyDay.Application.DTOs;

public record SparkResponse(
    int Id,
    string TaskText,
    string MotivationalMessage,
    DateTime Date,
    bool IsCompleted,
    DateTime? CompletedAt
);

public record StreakResponse(
    int CurrentStreak,
    int LongestStreak,
    int TotalCompleted,
    DateTime? LastCompletedDate,
    List<BadgeResponse> Badges
);

public record BadgeResponse(
    string Key,
    string Name,
    string Icon,
    string Description,
    DateTime EarnedAt
);

public record HeatmapEntry(
    string Date,   // "2026-05-31"
    bool Completed
);