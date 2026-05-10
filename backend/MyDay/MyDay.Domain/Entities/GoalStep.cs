namespace MyDay.Domain.Entities;

// Represents one small step inside a Goal
// e.g. Goal: "Learn Docker" → Steps: "Install Docker", "Read docs", "Build first container"
public class GoalStep
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;       // e.g. "Install Docker"
    public bool IsCompleted { get; set; } = false;          // Done or not

    // Every step belongs to one Goal
    public int GoalId { get; set; }
    public Goal Goal { get; set; } = null!;
}