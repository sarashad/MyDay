using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MyDay.Application.Interfaces;
using System.Security.Claims;

namespace MyDay.API.Controllers;

[Authorize]
[ApiController]
[Route("api/spark")]
public class SparkController : ControllerBase
{
    private readonly ISparkService _spark;

    public SparkController(ISparkService spark) => _spark = spark;

    private int UserId => int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

    [HttpGet("today")]
    public async Task<IActionResult> GetToday()
        => Ok(await _spark.GetTodaySparkAsync(UserId));

    [HttpPatch("today/complete")]
    public async Task<IActionResult> Complete()
        => Ok(await _spark.CompleteSparkAsync(UserId));

    [HttpGet("streak")]
    public async Task<IActionResult> GetStreak()
        => Ok(await _spark.GetStreakAsync(UserId));

    [HttpGet("heatmap")]
    public async Task<IActionResult> GetHeatmap()
        => Ok(await _spark.GetHeatmapAsync(UserId));
}