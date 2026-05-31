namespace MyDay.Domain.Entities;

public class DailySpark
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public User User { get; set; } = null!;

    public string TaskText { get; set; } = string.Empty;
    public string MotivationalMessage { get; set; } = string.Empty;

    public DateTime Date { get; set; }           // فقط تاریخ، بدون time
    public bool IsCompleted { get; set; }
    public DateTime? CompletedAt { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}