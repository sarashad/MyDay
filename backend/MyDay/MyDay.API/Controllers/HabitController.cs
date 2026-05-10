using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MyDay.Application.DTOs;
using MyDay.Application.Interfaces;
using System.Security.Claims;

namespace MyDay.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class HabitController : ControllerBase
{
    private readonly IHabitService _habitService;

    public HabitController(IHabitService habitService)
    {
        _habitService = habitService;
    }

    private int GetUserId() =>
        int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)
            ?? User.FindFirstValue("sub")
            ?? throw new Exception("User not found"));

    // GET /api/habit
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        try
        {
            var result = await _habitService.GetAllAsync(GetUserId());
            return Ok(result);
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    // POST /api/habit
    [HttpPost]
    public async Task<IActionResult> Create(CreateHabitDto dto)
    {
        try
        {
            var result = await _habitService.CreateAsync(dto, GetUserId());
            return Ok(result);
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    // POST /api/habit/{id}/log
    [HttpPost("{id}/log")]
    public async Task<IActionResult> LogToday(int id, CreateHabitLogDto dto)
    {
        try
        {
            var result = await _habitService.LogTodayAsync(id, dto, GetUserId());
            return Ok(result);
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    // DELETE /api/habit/{id}
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        try
        {
            await _habitService.DeleteAsync(id, GetUserId());
            return NoContent();
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }
}