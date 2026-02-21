using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;
using RecipeExchange.Api.Models;
using System.Text.Json;

namespace RecipeExchange.Api.Data;

public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
{
    public DbSet<User> Users => Set<User>();
    public DbSet<Recipe> Recipes => Set<Recipe>();
    public DbSet<Vote> Votes => Set<Vote>();
    public DbSet<SavedRecipe> SavedRecipes => Set<SavedRecipe>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        var jsonOptions = new JsonSerializerOptions();

        modelBuilder.Entity<User>(b =>
        {
            b.HasKey(u => u.Id);
            b.HasIndex(u => u.Email).IsUnique();
            b.HasIndex(u => u.Username).IsUnique();
            b.Property(u => u.Email).HasMaxLength(256);
            b.Property(u => u.Username).HasMaxLength(50);
            b.Property(u => u.EmailConfirmationToken).HasMaxLength(128);
            b.Property(u => u.PasswordResetToken).HasMaxLength(128);
        });

        modelBuilder.Entity<Recipe>(b =>
        {
            b.HasKey(r => r.Id);
            b.Property(r => r.Title).HasMaxLength(200);
            b.Property(r => r.Difficulty).HasMaxLength(10);
            b.Property(r => r.Category).HasMaxLength(20);

            var ingredientComparer = new ValueComparer<List<Ingredient>>(
                (a, b) => JsonSerializer.Serialize(a, jsonOptions) == JsonSerializer.Serialize(b, jsonOptions),
                v => JsonSerializer.Serialize(v, jsonOptions).GetHashCode(),
                v => JsonSerializer.Deserialize<List<Ingredient>>(JsonSerializer.Serialize(v, jsonOptions), jsonOptions)!);

            var stringListComparer = new ValueComparer<List<string>>(
                (a, b) => JsonSerializer.Serialize(a, jsonOptions) == JsonSerializer.Serialize(b, jsonOptions),
                v => JsonSerializer.Serialize(v, jsonOptions).GetHashCode(),
                v => JsonSerializer.Deserialize<List<string>>(JsonSerializer.Serialize(v, jsonOptions), jsonOptions)!);

            b.Property(r => r.Ingredients)
                .HasConversion(
                    v => JsonSerializer.Serialize(v, jsonOptions),
                    v => JsonSerializer.Deserialize<List<Ingredient>>(v, jsonOptions) ?? new())
                .HasColumnType("json")
                .Metadata.SetValueComparer(ingredientComparer);

            b.Property(r => r.Instructions)
                .HasConversion(
                    v => JsonSerializer.Serialize(v, jsonOptions),
                    v => JsonSerializer.Deserialize<List<string>>(v, jsonOptions) ?? new())
                .HasColumnType("json")
                .Metadata.SetValueComparer(stringListComparer);

            b.Property(r => r.Tags)
                .HasConversion(
                    v => JsonSerializer.Serialize(v, jsonOptions),
                    v => JsonSerializer.Deserialize<List<string>>(v, jsonOptions) ?? new())
                .HasColumnType("json")
                .Metadata.SetValueComparer(stringListComparer);

            b.HasOne<User>()
                .WithMany()
                .HasForeignKey(r => r.AuthorId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<Vote>(b =>
        {
            b.HasKey(v => v.Id);
            b.HasIndex(v => new { v.UserId, v.RecipeId }).IsUnique();
            b.Property(v => v.VoteType).HasMaxLength(10);

            b.HasOne<User>()
                .WithMany()
                .HasForeignKey(v => v.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            b.HasOne<Recipe>()
                .WithMany()
                .HasForeignKey(v => v.RecipeId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<SavedRecipe>(b =>
        {
            b.HasKey(s => s.Id);
            b.HasIndex(s => new { s.UserId, s.RecipeId }).IsUnique();

            b.HasOne<User>()
                .WithMany()
                .HasForeignKey(s => s.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            b.HasOne<Recipe>()
                .WithMany()
                .HasForeignKey(s => s.RecipeId)
                .OnDelete(DeleteBehavior.Cascade);
        });
    }
}
