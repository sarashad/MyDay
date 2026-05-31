namespace MyDay.Domain.Entities;

public class SparkStreak
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public User User { get; set; } = null!;

    public int CurrentStreak { get; set; }
    public int LongestStreak { get; set; }
    public DateTime? LastCompletedDate { get; set; }
    public int TotalCompleted { get; set; }      
}