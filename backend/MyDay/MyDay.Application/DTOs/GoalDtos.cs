namespace MyDay.Application.DTOs;

public class GoalDto
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }
    public DateTime? Deadline { get; set; }
    public bool IsCompleted { get; set; }
    public DateTime CreatedAt { get; set; }
    public List<GoalStepDto> Steps { get; set; } = new();
    public int TotalSteps { get; set; }         // Total number of steps
    public int CompletedSteps { get; set; }     // How many steps are done
    public int ProgressPercent { get; set; }    // e.g. 75%
}

public class GoalStepDto
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public bool IsCompleted { get; set; }
}

public class CreateGoalDto
{
    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }
    public DateTime? Deadline { get; set; }
    public List<string> Steps { get; set; } = new(); // List of step titles
}

public class UpdateGoalDto
{
    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }
    public DateTime? Deadline { get; set; }
}