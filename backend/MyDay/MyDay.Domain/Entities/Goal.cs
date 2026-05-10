namespace MyDay.Domain.Entities;

// Represents a big goal the user wants to achieve
// e.g. "Learn Docker", "Run 5km"
public class Goal
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;       // e.g. "Learn Docker"
    public string? Description { get; set; }                // Optional details
    public DateTime? Deadline { get; set; }                 // Optional deadline
    public bool IsCompleted { get; set; } = false;          // Finished or not
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // Every goal belongs to one User
    public int UserId { get; set; }
    public User User { get; set; } = null!;

    // One goal has MANY small steps
    public ICollection<GoalStep> Steps { get; set; } = new List<GoalStep>();
}