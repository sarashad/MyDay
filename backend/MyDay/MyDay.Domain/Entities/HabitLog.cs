namespace MyDay.Domain.Entities;

// Records ONE completion of a habit on a specific date
// e.g. "Sport" was done on 10.05.2026
public class HabitLog
{
    public int Id { get; set; }
    public DateTime CompletedDate { get; set; }             // The day it was completed
    public string? Note { get; set; }                       // Optional note e.g. "30 min run"

    // Every log belongs to one Habit
    public int HabitId { get; set; }
    public Habit Habit { get; set; } = null!;
}