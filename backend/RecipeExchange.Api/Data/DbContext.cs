using System.Text.Json;

namespace RecipeExchange.Api.Data;

public class DbContext(DbContextOptions<DbContext> options) : DbContext(options)
{
    public static DbSet<User> Users => Set<User>();
    public static DbSet<Recipe> Recipes => Set<Recipe>();
    public static DbSet<Vote> Votes => Set<Vote>();

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
            b.Property(u => u.DisplayName).HasMaxLength(100);
        });

        modelBuilder.Entity<Recipe>(b =>
        {
            b.HasKey(r => r.Id);
            b.Property(r => r.Title).HasMaxLength(200);
            b.Property(r => r.Difficulty).HasMaxLength(10);
            b.Property(r => r.Category).HasMaxLength(20);

            b.Property(r => r.Ingredients)
                .HasConversion(
                    v => JsonSerializer.Serialize(v, jsonOptions),
                    v => JsonSerializer.Deserialize<List<Ingredient>>(v, jsonOptions) ?? new())
                .HasColumnType("json");

            b.Property(r => r.Instructions)
                .HasConversion(
                    v => JsonSerializer.Serialize(v, jsonOptions),
                    v => JsonSerializer.Deserialize<List<string>>(v, jsonOptions) ?? new())
                .HasColumnType("json");

            b.Property(r => r.Tags)
                .HasConversion(
                    v => JsonSerializer.Serialize(v, jsonOptions),
                    v => JsonSerializer.Deserialize<List<string>>(v, jsonOptions) ?? new())
                .HasColumnType("json");

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
    }
}
