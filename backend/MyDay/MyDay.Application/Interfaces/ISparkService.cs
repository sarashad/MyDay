using MyDay.Application.DTOs;

namespace MyDay.Application.Interfaces;

public interface ISparkService
{
    Task<SparkResponse> GetTodaySparkAsync(int userId);
    Task<SparkResponse> CompleteSparkAsync(int userId);
    Task<StreakResponse> GetStreakAsync(int userId);
    Task<List<HeatmapEntry>> GetHeatmapAsync(int userId);
}