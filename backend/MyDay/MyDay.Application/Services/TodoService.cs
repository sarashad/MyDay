using Microsoft.EntityFrameworkCore;
using MyDay.Application.DTOs;
using MyDay.Application.Interfaces;
using MyDay.Domain.Entities;
using MyDay.Infrastructure.Data;

namespace MyDay.Application.Services;

public class TodoService : ITodoService
{
    private readonly AppDbContext _db;

    public TodoService(AppDbContext db)
    {
        _db = db;
    }

    // ── GET ALL ──────────────────────────────────────────
    public async Task<List<TodoDto>> GetAllAsync(int userId)
    {
        // Get all todos that belong to this user
        // OrderBy → newest first
        return await _db.Todos
            .Where(t => t.UserId == userId)
            .OrderByDescending(t => t.CreatedAt)
            .Select(t => ToDto(t))
            .ToListAsync();
    }

    // ── GET BY ID ────────────────────────────────────────
    public async Task<TodoDto> GetByIdAsync(int id, int userId)
    {
        var todo = await _db.Todos
            .FirstOrDefaultAsync(t => t.Id == id && t.UserId == userId);

        // If not found → throw error
        if (todo == null)
            throw new Exception("Todo not found.");

        return ToDto(todo);
    }

    // ── CREATE ───────────────────────────────────────────
    public async Task<TodoDto> CreateAsync(CreateTodoDto dto, int userId)
    {
        // Create new Todo entity from the DTO
        var todo = new Todo
        {
            Title = dto.Title,
            Description = dto.Description,
            Priority = dto.Priority,
            DueDate = dto.DueDate,
            UserId = userId          // Connect to the logged in user
        };

        _db.Todos.Add(todo);
        await _db.SaveChangesAsync();

        return ToDto(todo);
    }

    // ── UPDATE ───────────────────────────────────────────
    public async Task<TodoDto> UpdateAsync(int id, UpdateTodoDto dto, int userId)
    {
        var todo = await _db.Todos
            .FirstOrDefaultAsync(t => t.Id == id && t.UserId == userId);

        if (todo == null)
            throw new Exception("Todo not found.");

        // Update the fields
        todo.Title = dto.Title;
        todo.Description = dto.Description;
        todo.Priority = dto.Priority;
        todo.DueDate = dto.DueDate;

        await _db.SaveChangesAsync();

        return ToDto(todo);
    }

    // ── COMPLETE ─────────────────────────────────────────
    public async Task<TodoDto> CompleteAsync(int id, int userId)
    {
        var todo = await _db.Todos
            .FirstOrDefaultAsync(t => t.Id == id && t.UserId == userId);

        if (todo == null)
            throw new Exception("Todo not found.");

        // Just flip the IsCompleted flag
        todo.IsCompleted = !todo.IsCompleted;

        await _db.SaveChangesAsync();

        return ToDto(todo);
    }

    // ── DELETE ───────────────────────────────────────────
    public async Task DeleteAsync(int id, int userId)
    {
        var todo = await _db.Todos
            .FirstOrDefaultAsync(t => t.Id == id && t.UserId == userId);

        if (todo == null)
            throw new Exception("Todo not found.");

        _db.Todos.Remove(todo);
        await _db.SaveChangesAsync();
    }

    // ── Convert Todo entity → TodoDto ────────────────────
    private static TodoDto ToDto(Todo t) => new TodoDto
    {
        Id = t.Id,
        Title = t.Title,
        Description = t.Description,
        IsCompleted = t.IsCompleted,
        Priority = t.Priority,
        DueDate = t.DueDate,
        CreatedAt = t.CreatedAt
    };
}