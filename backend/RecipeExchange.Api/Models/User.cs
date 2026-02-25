using System.Text.Json.Serialization;

namespace RecipeExchange.Api.Models;

public class User
{
    public string Id { get; set; } = Guid.NewGuid().ToString();
    public string Username { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string? AvatarUrl { get; set; }
    public string? Bio { get; set; }
    public string Role { get; set; } = "user";
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    [JsonIgnore]
    public string PasswordHash { get; set; } = string.Empty;

    public bool EmailConfirmed { get; set; } = false;

    [JsonIgnore]
    public string? EmailConfirmationToken { get; set; }

    [JsonIgnore]
    public DateTime? EmailConfirmationTokenExpiry { get; set; }

    [JsonIgnore]
    public string? PasswordResetToken { get; set; }

    [JsonIgnore]
    public DateTime? PasswordResetTokenExpiry { get; set; }

    [JsonIgnore]
    public string? PendingEmail { get; set; }

    [JsonIgnore]
    public string? EmailChangeToken { get; set; }

    [JsonIgnore]
    public DateTime? EmailChangeTokenExpiry { get; set; }

    [JsonIgnore]
    public int FailedLoginAttempts { get; set; } = 0;

    [JsonIgnore]
    public DateTime? LockoutEnd { get; set; }
}
