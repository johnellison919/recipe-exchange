namespace RecipeExchange.Api.Dtos;

public record IngredientDto(string Name, string Amount, string Unit);

public record RecipeResponse(
    string Id,
    string Title,
    string Description,
    List<IngredientDto> Ingredients,
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
    string Title,
    string Description,
    List<IngredientDto> Ingredients,
    List<string> Instructions,
    int PrepTime,
    int CookTime,
    int Servings,
    string Difficulty,
    string Category,
    List<string> Tags,
    string? ImageUrl);

public record UpdateRecipeRequest(
    string? Title,
    string? Description,
    List<IngredientDto>? Ingredients,
    List<string>? Instructions,
    int? PrepTime,
    int? CookTime,
    int? Servings,
    string? Difficulty,
    string? Category,
    List<string>? Tags,
    string? ImageUrl);
