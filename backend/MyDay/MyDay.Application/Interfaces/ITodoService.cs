using MyDay.Application.DTOs;

namespace MyDay.Application.Interfaces;

public interface ITodoService
{
    // Get all todos for a specific user
    Task<List<TodoDto>> GetAllAsync(int userId);

    // Get one todo by id
    Task<TodoDto> GetByIdAsync(int id, int userId);

    // Create a new todo
    Task<TodoDto> CreateAsync(CreateTodoDto dto, int userId);

    // Update existing todo
    Task<TodoDto> UpdateAsync(int id, UpdateTodoDto dto, int userId);

    // Mark todo as complete
    Task<TodoDto> CompleteAsync(int id, int userId);

    // Delete todo
    Task DeleteAsync(int id, int userId);
}