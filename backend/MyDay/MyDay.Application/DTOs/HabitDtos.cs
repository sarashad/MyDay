namespace MyDay.Application.DTOs;

public class HabitDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Icon { get; set; }
    public int TargetCount { get; set; }        
    public DateTime CreatedAt { get; set; }
    public int CurrentStreak { get; set; }
    public bool CompletedToday { get; set; }
    public int TodayCount { get; set; }         
}

public class CreateHabitDto
{
    public string Name { get; set; } = string.Empty;
    public string? Icon { get; set; }
    public int TargetCount { get; set; } = 1;   // default = 1
}

public class HabitLogDto
{
    public int Id { get; set; }
    public DateTime CompletedDate { get; set; }
    public string? Note { get; set; }
    public int Count { get; set; }
}

public class CreateHabitLogDto
{
    public string? Note { get; set; }
}