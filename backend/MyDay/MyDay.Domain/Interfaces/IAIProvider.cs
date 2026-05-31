namespace MyDay.Domain.Interfaces;

public interface IAIProvider
{
    Task<AISparkResult> GenerateDailySparkAsync(SparkContext context);
}

public record SparkContext(
    int CompletedTodosYesterday,
    int CurrentStreak,
    string? UserFirstName
);

public record AISparkResult(
    string TaskText,
    string MotivationalMessage
);