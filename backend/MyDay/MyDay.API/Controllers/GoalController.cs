using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MyDay.Application.DTOs;
using MyDay.Application.Interfaces;
using System.Security.Claims;

namespace MyDay.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class GoalController : ControllerBase
{
    private readonly IGoalService _goalService;

    public GoalController(IGoalService goalService)
    {
        _goalService = goalService;
    }

    private int GetUserId() =>
        int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)
            ?? User.FindFirstValue("sub")
            ?? throw new Exception("User not found"));

    // GET /api/goal
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        try
        {
            var result = await _goalService.GetAllAsync(GetUserId());
            return Ok(result);
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    // GET /api/goal/{id}
    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        try
        {
            var result = await _goalService.GetByIdAsync(id, GetUserId());
            return Ok(result);
        }
        catch (Exception ex)
        {
            return NotFound(new { message = ex.Message });
        }
    }

    // POST /api/goal
    [HttpPost]
    public async Task<IActionResult> Create(CreateGoalDto dto)
    {
        try
        {
            var result = await _goalService.CreateAsync(dto, GetUserId());
            return Ok(result);
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    // PUT /api/goal/{id}
    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, UpdateGoalDto dto)
    {
        try
        {
            var result = await _goalService.UpdateAsync(id, dto, GetUserId());
            return Ok(result);
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    // PATCH /api/goal/{goalId}/steps/{stepId}
    [HttpPatch("{goalId}/steps/{stepId}")]
    public async Task<IActionResult> CompleteStep(int goalId, int stepId)
    {
        try
        {
            var result = await _goalService.CompleteStepAsync(goalId, stepId, GetUserId());
            return Ok(result);
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    // DELETE /api/goal/{id}
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        try
        {
            await _goalService.DeleteAsync(id, GetUserId());
            return NoContent();
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }
}