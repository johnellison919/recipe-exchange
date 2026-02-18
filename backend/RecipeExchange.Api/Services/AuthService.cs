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

        return (user, null);
    }

    public async Task<(User? user, string? error)> Register(RegisterRequest request)
    {
        if (await db.Users.AnyAsync(u => u.Email == request.Email))
            return (null, "Email already in use.");

        if (await db.Users.AnyAsync(u => u.Username == request.Username))
            return (null, "Username already taken.");

        var user = new User
        {
            Username = request.Username,
            Email = request.Email,
            DisplayName = request.DisplayName,
            AvatarUrl = $"https://i.pravatar.cc/150?u={request.Email}"
        };
        user.PasswordHash = hasher.HashPassword(user, request.Password);

        db.Users.Add(user);
        await db.SaveChangesAsync();

        return (user, null);
    }

    public async Task<User?> GetById(string id) => await db.Users.FindAsync(id);

    public static UserResponse MapUser(User user) =>
        new(user.Id, user.Username, user.Email, user.DisplayName, user.AvatarUrl, user.Bio, user.CreatedAt);
}
