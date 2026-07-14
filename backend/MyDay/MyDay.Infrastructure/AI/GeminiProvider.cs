using System.Net.Http.Json;
using System.Text.Json;
using MyDay.Domain.Interfaces;
using Microsoft.Extensions.Configuration;

namespace MyDay.Infrastructure.AI;

public class GeminiProvider : IAIProvider
{
    private readonly HttpClient _http;
    private readonly string _apiKey;
    private readonly string _model;

    public GeminiProvider(HttpClient http, IConfiguration config)
    {
        _http = http;
        _apiKey = config["AI:ApiKey"]!;
        _model = config["AI:Model"] ?? "gemini-2.0-flash";
    }

    public async Task<AISparkResult> GenerateDailySparkAsync(SparkContext ctx)
    {
        var prompt = $$"""
            You are a friendly life coach. Be concise and warm.
            User info: name={{ctx.UserFirstName}}, streak={{ctx.CurrentStreak}} days,
            completed {{ctx.CompletedTodosYesterday}} todos yesterday.

            Respond ONLY with valid JSON, no markdown, no extra text:
            {"task": "one small actionable task under 10 words", "message": "one warm motivational sentence under 20 words"}
            """;

        var requestBody = new
        {
            contents = new[]
            {
                new { parts = new[] { new { text = prompt } } }
            }
        };

        var url = $"https://generativelanguage.googleapis.com/v1beta/models/{_model}:generateContent?key={_apiKey}";
        var response = await _http.PostAsJsonAsync(url, requestBody);
        response.EnsureSuccessStatusCode();

        var json = await response.Content.ReadFromJsonAsync<JsonElement>();
        var raw = json
            .GetProperty("candidates")[0]
            .GetProperty("content")
            .GetProperty("parts")[0]
            .GetProperty("text")
            .GetString() ?? "{}";

        var result = JsonSerializer.Deserialize<AISparkResult>(
            raw,
            new JsonSerializerOptions { PropertyNameCaseInsensitive = true }
        );

        return result ?? new AISparkResult(
            "Do one small thing that makes you proud today.",
            "You're doing great — keep going!"
        );
    }
}