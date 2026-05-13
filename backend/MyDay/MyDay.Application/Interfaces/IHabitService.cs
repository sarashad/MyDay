using MyDay.Application.DTOs;

namespace MyDay.Application.Interfaces;

public interface IHabitService
{
    Task<List<HabitDto>> GetAllAsync(int userId);
    Task<HabitDto> CreateAsync(CreateHabitDto dto, int userId);
    Task<HabitDto> LogTodayAsync(int habitId, CreateHabitLogDto dto, int userId);
    Task<HabitDto> UndoTodayAsync(int habitId, int userId);  // ← NEW
    Task DeleteAsync(int id, int userId);
}