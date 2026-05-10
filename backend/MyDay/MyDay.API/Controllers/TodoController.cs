using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MyDay.Application.DTOs;
using MyDay.Application.Interfaces;
using System.Security.Claims;

namespace MyDay.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize] 
public class TodoController : ControllerBase
{
    private readonly ITodoService _todoService;

    public TodoController(ITodoService todoService)
    {
        _todoService = todoService;
    }

    // Get the logged in user's ID from the JWT token
    private int GetUserId() =>
        int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)
            ?? User.FindFirstValue("sub")
            ?? throw new Exception("User not found"));

    // GET /api/todo
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        try
        {
            var result = await _todoService.GetAllAsync(GetUserId());
            return Ok(result);
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    // GET /api/todo/{id}
    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        try
        {
            var result = await _todoService.GetByIdAsync(id, GetUserId());
            return Ok(result);
        }
        catch (Exception ex)
        {
            return NotFound(new { message = ex.Message });
        }
    }

    // POST /api/todo
    [HttpPost]
    public async Task<IActionResult> Create(CreateTodoDto dto)
    {
        try
        {
            var result = await _todoService.CreateAsync(dto, GetUserId());
            return Ok(result);
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    // PUT /api/todo/{id}
    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, UpdateTodoDto dto)
    {
        try
        {
            var result = await _todoService.UpdateAsync(id, dto, GetUserId());
            return Ok(result);
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    // PATCH /api/todo/{id}/complete
    [HttpPatch("{id}/complete")]
    public async Task<IActionResult> Complete(int id)
    {
        try
        {
            var result = await _todoService.CompleteAsync(id, GetUserId());
            return Ok(result);
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    // DELETE /api/todo/{id}
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        try
        {
            await _todoService.DeleteAsync(id, GetUserId());
            return NoContent(); // 204 - success but nothing to return
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }
}