using MyDay.Domain.Entities;

public class HabitLog
{
    public int Id { get; set; }
    public DateTime CompletedDate { get; set; }
    public string? Note { get; set; }
    public int Count { get; set; } = 1; // ← ADD THIS

    public int HabitId { get; set; }
    public Habit Habit { get; set; } = null!;
}