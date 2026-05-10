namespace MyDay.Domain.Entities;

// Represents a daily habit the user wants to track
// e.g. "Drink water", "Read 30 minutes", "Sport"
public class Habit
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;        // e.g. "Morning sport"
    public string? Icon { get; set; }                       // Optional emoji e.g. "💪"
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // Every habit belongs to one User
    public int UserId { get; set; }
    public User User { get; set; } = null!;

    // One habit can have MANY logs (one per day it was completed)
    public ICollection<HabitLog> Logs { get; set; } = new List<HabitLog>();
}