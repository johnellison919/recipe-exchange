using System.Security.Cryptography;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using RecipeExchange.Api.Data;
using RecipeExchange.Api.Dtos;
using RecipeExchange.Api.Models;

namespace RecipeExchange.Api.Services;

public class AuthService(AppDbContext db, IPasswordHasher<User> hasher)
{
    public async Task<(User? user, string? error)> ValidateLogin(LoginRequest request)
    {
        var user = await db.Users.FirstOrDefaultAsync(u => u.Email == request.Email);
        if (user is null)
            return (null, "Invalid email or password.");

        var result = hasher.VerifyHashedPassword(user, user.PasswordHash, request.Password);
        if (result == PasswordVerificationResult.Failed)
            return (null, "Invalid email or password.");

        if (!user.EmailConfirmed)
            return (null, "Please confirm your email address before logging in.");

        return (user, null);
    }

    public async Task<(string? token, string? error)> Register(RegisterRequest request)
    {
        if (await db.Users.AnyAsync(u => u.Email == request.Email))
            return (null, "Email already in use.");

        if (await db.Users.AnyAsync(u => u.Username == request.Username))
            return (null, "Username already taken.");

        var token = GenerateSecureToken();

        var user = new User
        {
            Username = request.Username,
            Email = request.Email,
            AvatarUrl = null,
            EmailConfirmed = false,
            EmailConfirmationToken = token,
            EmailConfirmationTokenExpiry = DateTime.UtcNow.AddHours(24)
        };
        user.PasswordHash = hasher.HashPassword(user, request.Password);

        db.Users.Add(user);
        await db.SaveChangesAsync();

        return (token, null);
    }

    public async Task<(bool success, string? error)> ConfirmEmail(string email, string token)
    {
        var user = await db.Users.FirstOrDefaultAsync(u => u.Email == email);
        if (user is null)
            return (false, "Invalid confirmation link.");

        if (user.EmailConfirmed)
            return (true, null);

        if (user.EmailConfirmationToken != token)
            return (false, "Invalid confirmation link.");

        if (user.EmailConfirmationTokenExpiry < DateTime.UtcNow)
            return (false, "Confirmation link has expired. Please request a new one.");

        user.EmailConfirmed = true;
        user.EmailConfirmationToken = null;
        user.EmailConfirmationTokenExpiry = null;
        await db.SaveChangesAsync();

        return (true, null);
    }

    public async Task<(User? user, string? token)> RequestPasswordReset(string email)
    {
        var user = await db.Users.FirstOrDefaultAsync(u => u.Email == email);
        if (user is null)
            return (null, null);

        var token = GenerateSecureToken();
        user.PasswordResetToken = token;
        user.PasswordResetTokenExpiry = DateTime.UtcNow.AddHours(1);
        await db.SaveChangesAsync();

        return (user, token);
    }

    public async Task<(bool success, string? error)> ResetPassword(string email, string token, string newPassword)
    {
        var user = await db.Users.FirstOrDefaultAsync(u => u.Email == email);
        if (user is null)
            return (false, "Invalid reset link.");

        if (user.PasswordResetToken != token)
            return (false, "Invalid reset link.");

        if (user.PasswordResetTokenExpiry < DateTime.UtcNow)
            return (false, "Reset link has expired. Please request a new one.");

        user.PasswordHash = hasher.HashPassword(user, newPassword);
        user.PasswordResetToken = null;
        user.PasswordResetTokenExpiry = null;
        await db.SaveChangesAsync();

        return (true, null);
    }

    public async Task<(User? user, string? token)> ResendConfirmation(string email)
    {
        var user = await db.Users.FirstOrDefaultAsync(u => u.Email == email);
        if (user is null || user.EmailConfirmed)
            return (null, null);

        var token = GenerateSecureToken();
        user.EmailConfirmationToken = token;
        user.EmailConfirmationTokenExpiry = DateTime.UtcNow.AddHours(24);
        await db.SaveChangesAsync();

        return (user, token);
    }

    public async Task<User?> GetById(string id) => await db.Users.FindAsync(id);

    public async Task<User?> GetByUsername(string username) =>
        await db.Users.FirstOrDefaultAsync(u => u.Username == username);

    public async Task<UserProfileResponse> GetProfile(User user)
    {
        var recipeCount = await db.Recipes.CountAsync(r => r.AuthorId == user.Id);
        var totalVoteScore = await db.Recipes
            .Where(r => r.AuthorId == user.Id)
            .SumAsync(r => r.VoteScore);

        return new UserProfileResponse(
            user.Id, user.Username, user.Email, user.AvatarUrl, user.Bio,
            user.CreatedAt, recipeCount, totalVoteScore);
    }

    public static UserResponse MapUser(User user) =>
        new(user.Id, user.Username, user.Email, user.AvatarUrl, user.Bio, user.CreatedAt);

    public async Task<(string? token, string? error)> RequestEmailChange(string userId, string newEmail)
    {
        var user = await db.Users.FindAsync(userId);
        if (user is null)
            return (null, "User not found.");

        if (user.Email == newEmail)
            return (null, "New email is the same as your current email.");

        if (await db.Users.AnyAsync(u => u.Email == newEmail))
            return (null, "Email already in use.");

        var token = GenerateSecureToken();
        user.PendingEmail = newEmail;
        user.EmailChangeToken = token;
        user.EmailChangeTokenExpiry = DateTime.UtcNow.AddHours(24);
        await db.SaveChangesAsync();

        return (token, null);
    }

    public async Task<(bool success, string? error)> ConfirmEmailChange(string userId, string token)
    {
        var user = await db.Users.FindAsync(userId);
        if (user is null)
            return (false, "User not found.");

        if (user.EmailChangeToken != token)
            return (false, "Invalid confirmation link.");

        if (user.EmailChangeTokenExpiry < DateTime.UtcNow)
            return (false, "Confirmation link has expired. Please request a new one.");

        if (await db.Users.AnyAsync(u => u.Email == user.PendingEmail))
            return (false, "Email already in use.");

        user.Email = user.PendingEmail!;
        user.PendingEmail = null;
        user.EmailChangeToken = null;
        user.EmailChangeTokenExpiry = null;
        await db.SaveChangesAsync();

        return (true, null);
    }

    public async Task<(bool success, string? error)> ChangePassword(string userId, string currentPassword, string newPassword)
    {
        var user = await db.Users.FindAsync(userId);
        if (user is null)
            return (false, "User not found.");

        var result = hasher.VerifyHashedPassword(user, user.PasswordHash, currentPassword);
        if (result == PasswordVerificationResult.Failed)
            return (false, "Current password is incorrect.");

        user.PasswordHash = hasher.HashPassword(user, newPassword);
        await db.SaveChangesAsync();

        return (true, null);
    }

    public async Task<(bool success, string? error)> UpdateAvatar(string userId, string? avatarUrl)
    {
        var user = await db.Users.FindAsync(userId);
        if (user is null)
            return (false, "User not found.");

        user.AvatarUrl = avatarUrl;
        await db.SaveChangesAsync();

        return (true, null);
    }

    private static string GenerateSecureToken()
    {
        var bytes = RandomNumberGenerator.GetBytes(64);
        return Convert.ToBase64String(bytes)
            .Replace("+", "-")
            .Replace("/", "_")
            .TrimEnd('=');
    }
}
