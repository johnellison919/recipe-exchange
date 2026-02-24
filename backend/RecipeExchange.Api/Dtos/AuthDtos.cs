using System.ComponentModel.DataAnnotations;

namespace RecipeExchange.Api.Dtos;

public record LoginRequest(
    [Required, EmailAddress] string Email,
    [Required, StringLength(256, MinimumLength = 8)] string Password);

public record RegisterRequest(
    [Required, StringLength(50, MinimumLength = 3)] string Username,
    [Required, EmailAddress] string Email,
    [Required, StringLength(256, MinimumLength = 8)] string Password);

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

public record ConfirmEmailRequest(
    [Required, EmailAddress] string Email,
    [Required] string Token);

public record ForgotPasswordRequest(
    [Required, EmailAddress] string Email);

public record ResetPasswordRequest(
    [Required, EmailAddress] string Email,
    [Required] string Token,
    [Required, StringLength(256, MinimumLength = 8)] string NewPassword);

public record ResendConfirmationRequest(
    [Required, EmailAddress] string Email);

public record ChangeEmailRequest(
    [Required, EmailAddress] string NewEmail);

public record ConfirmEmailChangeRequest(
    [Required] string Token);

public record ChangePasswordRequest(
    [Required] string CurrentPassword,
    [Required, StringLength(256, MinimumLength = 8)] string NewPassword);

public record UpdateAvatarRequest(string? AvatarUrl);
