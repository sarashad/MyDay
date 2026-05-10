using Microsoft.EntityFrameworkCore;
using MyDay.Application.DTOs;
using MyDay.Application.Interfaces;
using MyDay.Domain.Entities;
using MyDay.Infrastructure.Data;

namespace MyDay.Application.Services;

public class GoalService : IGoalService
{
    private readonly AppDbContext _db;

    public GoalService(AppDbContext db)
    {
        _db = db;
    }

    // ── GET ALL ──────────────────────────────────────────
    public async Task<List<GoalDto>> GetAllAsync(int userId)
    {
        var goals = await _db.Goals
            .Where(g => g.UserId == userId)
            .Include(g => g.Steps)
            .OrderByDescending(g => g.CreatedAt)
            .ToListAsync();

        return goals.Select(g => ToDto(g)).ToList();
    }

    // ── GET BY ID ────────────────────────────────────────
    public async Task<GoalDto> GetByIdAsync(int id, int userId)
    {
        var goal = await _db.Goals
            .Include(g => g.Steps)
            .FirstOrDefaultAsync(g => g.Id == id && g.UserId == userId);

        if (goal == null)
            throw new Exception("Goal not found.");

        return ToDto(goal);
    }

    // ── CREATE ───────────────────────────────────────────
    public async Task<GoalDto> CreateAsync(CreateGoalDto dto, int userId)
    {
        var goal = new Goal
        {
            Title = dto.Title,
            Description = dto.Description,
            Deadline = dto.Deadline,
            UserId = userId,
            // Create steps from the list of step titles
            Steps = dto.Steps.Select(s => new GoalStep
            {
                Title = s,
                IsCompleted = false
            }).ToList()
        };

        _db.Goals.Add(goal);
        await _db.SaveChangesAsync();

        return ToDto(goal);
    }

    // ── UPDATE ───────────────────────────────────────────
    public async Task<GoalDto> UpdateAsync(int id, UpdateGoalDto dto, int userId)
    {
        var goal = await _db.Goals
            .Include(g => g.Steps)
            .FirstOrDefaultAsync(g => g.Id == id && g.UserId == userId);

        if (goal == null)
            throw new Exception("Goal not found.");

        goal.Title = dto.Title;
        goal.Description = dto.Description;
        goal.Deadline = dto.Deadline;

        await _db.SaveChangesAsync();
        return ToDto(goal);
    }

    // ── COMPLETE STEP ────────────────────────────────────
    public async Task<GoalDto> CompleteStepAsync(int goalId, int stepId, int userId)
    {
        var goal = await _db.Goals
            .Include(g => g.Steps)
            .FirstOrDefaultAsync(g => g.Id == goalId && g.UserId == userId);

        if (goal == null)
            throw new Exception("Goal not found.");

        var step = goal.Steps.FirstOrDefault(s => s.Id == stepId);
        if (step == null)
            throw new Exception("Step not found.");

        // Toggle step completion
        step.IsCompleted = !step.IsCompleted;

        // Auto-complete goal if ALL steps are done
        goal.IsCompleted = goal.Steps.All(s => s.IsCompleted);

        await _db.SaveChangesAsync();
        return ToDto(goal);
    }

    // ── DELETE ───────────────────────────────────────────
    public async Task DeleteAsync(int id, int userId)
    {
        var goal = await _db.Goals
            .FirstOrDefaultAsync(g => g.Id == id && g.UserId == userId);

        if (goal == null)
            throw new Exception("Goal not found.");

        _db.Goals.Remove(goal);
        await _db.SaveChangesAsync();
    }

    // ── HELPER ───────────────────────────────────────────
    private static GoalDto ToDto(Goal g)
    {
        var totalSteps = g.Steps.Count;
        var completedSteps = g.Steps.Count(s => s.IsCompleted);
        var percent = totalSteps == 0 ? 0 : (completedSteps * 100 / totalSteps);

        return new GoalDto
        {
            Id = g.Id,
            Title = g.Title,
            Description = g.Description,
            Deadline = g.Deadline,
            IsCompleted = g.IsCompleted,
            CreatedAt = g.CreatedAt,
            Steps = g.Steps.Select(s => new GoalStepDto
            {
                Id = s.Id,
                Title = s.Title,
                IsCompleted = s.IsCompleted
            }).ToList(),
            TotalSteps = totalSteps,
            CompletedSteps = completedSteps,
            ProgressPercent = percent
        };
    }
}