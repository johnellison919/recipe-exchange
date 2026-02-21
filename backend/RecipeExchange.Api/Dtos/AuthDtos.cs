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

public record UserProfileResponse(
    string Id,
    string Username,
    string Email,
    string? AvatarUrl,
    string? Bio,
    DateTime CreatedAt,
    int RecipeCount,
    int TotalVoteScore);

public record ConfirmEmailRequest(string Email, string Token);

public record ForgotPasswordRequest(string Email);

public record ResetPasswordRequest(string Email, string Token, string NewPassword);

public record ResendConfirmationRequest(string Email);

public record ChangeEmailRequest(string NewEmail);

public record ConfirmEmailChangeRequest(string Token);

public record ChangePasswordRequest(string CurrentPassword, string NewPassword);

public record UpdateAvatarRequest(string? AvatarUrl);
