using MyDay.Application.DTOs;

namespace MyDay.Application.Interfaces;

public interface IGoalService
{
    Task<List<GoalDto>> GetAllAsync(int userId);
    Task<GoalDto> GetByIdAsync(int id, int userId);
    Task<GoalDto> CreateAsync(CreateGoalDto dto, int userId);
    Task<GoalDto> UpdateAsync(int id, UpdateGoalDto dto, int userId);
    Task<GoalDto> CompleteStepAsync(int goalId, int stepId, int userId);
    Task DeleteAsync(int id, int userId);
}