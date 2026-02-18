namespace RecipeExchange.Api.Dtos;

public record LoginRequest(string Email, string Password);

public record RegisterRequest(
    string Username,
    string Email,
    string Password);

public record UserResponse(
    string Id,
    string Username,
    string Email,
    string? AvatarUrl,
    string? Bio,
    DateTime CreatedAt);
