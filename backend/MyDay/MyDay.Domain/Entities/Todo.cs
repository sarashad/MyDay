namespace MyDay.Domain.Entities;

// Represents one Todo item in the database
// "Priority" tells us how important the todo is
public enum Priority { Low, Medium, High }

public class Todo
{
    public int Id { get; set; }                              // Unique ID
    public string Title { get; set; } = string.Empty;       // e.g. "Buy milk"
    public string? Description { get; set; }                // Optional extra details
    public bool IsCompleted { get; set; } = false;          // Done or not done
    public Priority Priority { get; set; } = Priority.Medium; // Low / Medium / High
    public DateTime? DueDate { get; set; }                  // Optional deadline
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // Every todo belongs to one User
    // This is the Foreign Key → connects to Users table
    public int UserId { get; set; }
    public User User { get; set; } = null!;
}