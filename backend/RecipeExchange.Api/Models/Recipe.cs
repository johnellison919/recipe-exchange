using System.Security.Cryptography;

namespace RecipeExchange.Api.Models;

public class Ingredient
{
    public string Name { get; set; } = string.Empty;
    public string Amount { get; set; } = string.Empty;
    public string Unit { get; set; } = string.Empty;
}

public class Recipe
{
    private static readonly char[] IdChars =
        "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789".ToCharArray();

    private static string GenerateId() =>
        new(Enumerable.Range(0, 7).Select(_ => IdChars[RandomNumberGenerator.GetInt32(IdChars.Length)]).ToArray());

    public string Id { get; set; } = GenerateId();
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public List<Ingredient> Ingredients { get; set; } = [];
    public List<string> Instructions { get; set; } = [];
    public int PrepTime { get; set; }
    public int CookTime { get; set; }
    public int Servings { get; set; }
    public string Difficulty { get; set; } = "easy";
    public string Category { get; set; } = "other";
    public List<string> Tags { get; set; } = [];
    public string? ImageUrl { get; set; }
    public string AuthorId { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    public int VoteScore { get; set; }
}
