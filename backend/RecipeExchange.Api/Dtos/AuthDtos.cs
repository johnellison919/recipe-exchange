namespace RecipeExchange.Api.Dtos;

public record LoginRequest(string Email, string Password);

public record RegisterRequest(
    string Username,
    string Email,
    string Password,
    string DisplayName);

public record UserResponse(
    string Id,
    string Username,
    string Email,
    string DisplayName,
    string? AvatarUrl,
    string? Bio,
    DateTime CreatedAt);

public record AuthResponse(UserResponse User, string Token);
