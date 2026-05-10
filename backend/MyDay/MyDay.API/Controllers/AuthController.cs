using Microsoft.AspNetCore.Mvc;
using MyDay.Application.DTOs;
using MyDay.Application.Interfaces;

namespace MyDay.API.Controllers;

// [ApiController] → enables automatic validation and error responses
// [Route] → this controller handles requests to /api/auth/...
[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;

    // IAuthService is injected automatically by ASP.NET Core
    // We don't create it manually — the framework does it for us!
    public AuthController(IAuthService authService)
    {
        _authService = authService;
    }

    // POST /api/auth/register
    [HttpPost("register")]
    public async Task<IActionResult> Register(RegisterDto dto)
    {
        try
        {
            var result = await _authService.RegisterAsync(dto);
            return Ok(result); // 200 + token response
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message }); // 400 + error message
        }
    }

    // POST /api/auth/login
    [HttpPost("login")]
    public async Task<IActionResult> Login(LoginDto dto)
    {
        try
        {
            var result = await _authService.LoginAsync(dto);
            return Ok(result); // 200 + token response
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message }); // 400 + error message
        }
    }
}