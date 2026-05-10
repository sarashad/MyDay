namespace MyDay.Application.DTOs;

public class HabitDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Icon { get; set; }
    public DateTime CreatedAt { get; set; }
    public int CurrentStreak { get; set; }      // How many days in a row
    public bool CompletedToday { get; set; }    // Did user check it today?
}

public class CreateHabitDto
{
    public string Name { get; set; } = string.Empty;
    public string? Icon { get; set; }
}

public class HabitLogDto
{
    public int Id { get; set; }
    public DateTime CompletedDate { get; set; }
    public string? Note { get; set; }
}

public class CreateHabitLogDto
{
    public string? Note { get; set; }
}