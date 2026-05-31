namespace MyDay.Domain.Entities;

public class SparkBadge
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public User User { get; set; } = null!;

    public string BadgeKey { get; set; } = string.Empty;  // "first_spark", "week_warrior", ...
    public DateTime EarnedAt { get; set; } = DateTime.UtcNow;
}