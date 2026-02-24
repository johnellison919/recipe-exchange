using System.ComponentModel.DataAnnotations;

namespace RecipeExchange.Api.Dtos;

public record IngredientGroupDto(string Name, List<string> Items);

public record RecipeResponse(
    string Id,
    string Title,
    string Description,
    List<IngredientGroupDto> Ingredients,
    List<string> Instructions,
    int PrepTime,
    int CookTime,
    int Servings,
    string Difficulty,
    string Category,
    List<string> Tags,
    string? ImageUrl,
    string AuthorId,
    UserResponse Author,
    DateTime CreatedAt,
    DateTime UpdatedAt,
    int VoteScore,
    string? UserVote,
    bool IsSaved);

public record CreateRecipeRequest(
    [Required, StringLength(200)] string Title,
    [StringLength(5000)] string Description,
    [Required] List<IngredientGroupDto> Ingredients,
    [Required] List<string> Instructions,
    int PrepTime,
    int CookTime,
    int Servings,
    [Required] string Difficulty,
    [Required] string Category,
    List<string> Tags,
    string? ImageUrl);

public record UpdateRecipeRequest(
    [StringLength(200)] string? Title,
    [StringLength(5000)] string? Description,
    List<IngredientGroupDto>? Ingredients,
    List<string>? Instructions,
    int? PrepTime,
    int? CookTime,
    int? Servings,
    string? Difficulty,
    string? Category,
    List<string>? Tags,
    string? ImageUrl);
