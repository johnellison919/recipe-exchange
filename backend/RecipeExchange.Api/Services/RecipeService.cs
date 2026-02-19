using Microsoft.EntityFrameworkCore;
using RecipeExchange.Api.Data;
using RecipeExchange.Api.Dtos;
using RecipeExchange.Api.Models;

namespace RecipeExchange.Api.Services;

public class RecipeService(AppDbContext db)
{
    public async Task<List<RecipeResponse>> GetAll(string? userId, string? authorId = null)
    {
        var query = db.Recipes.AsQueryable();
        if (authorId is not null)
            query = query.Where(r => r.AuthorId == authorId);
        var recipes = await query.OrderByDescending(r => r.CreatedAt).ToListAsync();

        var authorIds = recipes.Select(r => r.AuthorId).Distinct().ToList();
        var authors = await db.Users
            .Where(u => authorIds.Contains(u.Id))
            .ToDictionaryAsync(u => u.Id);

        var userVotes = userId is not null
            ? await db.Votes
                .Where(v => v.UserId == userId)
                .ToDictionaryAsync(v => v.RecipeId, v => v.VoteType)
            : [];

        var savedIds = userId is not null
            ? (await db.SavedRecipes
                .Where(s => s.UserId == userId)
                .Select(s => s.RecipeId)
                .ToListAsync())
                .ToHashSet()
            : new HashSet<string>();

        return recipes
            .Where(r => authors.ContainsKey(r.AuthorId))
            .Select(r => MapRecipe(r, authors[r.AuthorId], userVotes.GetValueOrDefault(r.Id), savedIds.Contains(r.Id)))
            .ToList();
    }

    public async Task<RecipeResponse?> GetById(string id, string? userId)
    {
        var recipe = await db.Recipes.FindAsync(id);
        if (recipe is null) return null;

        var author = await db.Users.FindAsync(recipe.AuthorId);
        if (author is null) return null;

        var userVote = userId is not null
            ? await db.Votes
                .Where(v => v.RecipeId == id && v.UserId == userId)
                .Select(v => v.VoteType)
                .FirstOrDefaultAsync()
            : null;

        var isSaved = userId is not null
            && await db.SavedRecipes.AnyAsync(s => s.UserId == userId && s.RecipeId == id);

        return MapRecipe(recipe, author, userVote, isSaved);
    }

    public async Task<RecipeResponse> Create(CreateRecipeRequest request, string authorId)
    {
        var recipe = new Recipe
        {
            Title = request.Title,
            Description = request.Description,
            Ingredients = request.Ingredients.Select(i => new Ingredient
            {
                Name = i.Name, Amount = i.Amount, Unit = i.Unit
            }).ToList(),
            Instructions = request.Instructions,
            PrepTime = request.PrepTime,
            CookTime = request.CookTime,
            Servings = request.Servings,
            Difficulty = request.Difficulty,
            Category = request.Category,
            Tags = request.Tags,
            ImageUrl = request.ImageUrl,
            AuthorId = authorId
        };

        db.Recipes.Add(recipe);
        await db.SaveChangesAsync();

        db.Votes.Add(new Vote { UserId = authorId, RecipeId = recipe.Id, VoteType = "upvote" });
        recipe.VoteScore = 1;
        await db.SaveChangesAsync();

        var author = (await db.Users.FindAsync(authorId))!;
        return MapRecipe(recipe, author, "upvote", false);
    }

    public async Task<(RecipeResponse? result, string? error)> Update(
        string id, UpdateRecipeRequest request, string userId)
    {
        var recipe = await db.Recipes.FindAsync(id);
        if (recipe is null) return (null, "not_found");
        if (recipe.AuthorId != userId) return (null, "forbidden");

        if (request.Title is not null) recipe.Title = request.Title;
        if (request.Description is not null) recipe.Description = request.Description;
        if (request.Ingredients is not null)
            recipe.Ingredients = request.Ingredients
                .Select(i => new Ingredient { Name = i.Name, Amount = i.Amount, Unit = i.Unit })
                .ToList();
        if (request.Instructions is not null) recipe.Instructions = request.Instructions;
        if (request.PrepTime is not null) recipe.PrepTime = request.PrepTime.Value;
        if (request.CookTime is not null) recipe.CookTime = request.CookTime.Value;
        if (request.Servings is not null) recipe.Servings = request.Servings.Value;
        if (request.Difficulty is not null) recipe.Difficulty = request.Difficulty;
        if (request.Category is not null) recipe.Category = request.Category;
        if (request.Tags is not null) recipe.Tags = request.Tags;
        if (request.ImageUrl is not null) recipe.ImageUrl = request.ImageUrl;
        recipe.UpdatedAt = DateTime.UtcNow;

        await db.SaveChangesAsync();

        var author = (await db.Users.FindAsync(recipe.AuthorId))!;
        var userVote = await db.Votes
            .Where(v => v.RecipeId == id && v.UserId == userId)
            .Select(v => v.VoteType)
            .FirstOrDefaultAsync();

        var isSaved = await db.SavedRecipes.AnyAsync(s => s.UserId == userId && s.RecipeId == id);

        return (MapRecipe(recipe, author, userVote, isSaved), null);
    }

    public async Task<List<RecipeResponse>> GetSaved(string userId)
    {
        var savedRecipeIds = await db.SavedRecipes
            .Where(s => s.UserId == userId)
            .OrderByDescending(s => s.CreatedAt)
            .Select(s => s.RecipeId)
            .ToListAsync();

        var recipes = await db.Recipes
            .Where(r => savedRecipeIds.Contains(r.Id))
            .ToListAsync();

        var authorIds = recipes.Select(r => r.AuthorId).Distinct().ToList();
        var authors = await db.Users
            .Where(u => authorIds.Contains(u.Id))
            .ToDictionaryAsync(u => u.Id);

        var userVotes = await db.Votes
            .Where(v => v.UserId == userId)
            .ToDictionaryAsync(v => v.RecipeId, v => v.VoteType);

        var recipeMap = recipes.ToDictionary(r => r.Id);

        return savedRecipeIds
            .Where(id => recipeMap.ContainsKey(id) && authors.ContainsKey(recipeMap[id].AuthorId))
            .Select(id =>
            {
                var r = recipeMap[id];
                return MapRecipe(r, authors[r.AuthorId], userVotes.GetValueOrDefault(r.Id), true);
            })
            .ToList();
    }

    public async Task<string?> Delete(string id, string userId)
    {
        var recipe = await db.Recipes.FindAsync(id);
        if (recipe is null) return "not_found";
        if (recipe.AuthorId != userId) return "forbidden";

        db.Recipes.Remove(recipe);
        await db.SaveChangesAsync();
        return null;
    }

    public static RecipeResponse MapRecipe(Recipe recipe, User author, string? userVote, bool isSaved = false) =>
        new(
            recipe.Id, recipe.Title, recipe.Description,
            recipe.Ingredients.Select(i => new IngredientDto(i.Name, i.Amount, i.Unit)).ToList(),
            recipe.Instructions, recipe.PrepTime, recipe.CookTime, recipe.Servings,
            recipe.Difficulty, recipe.Category, recipe.Tags, recipe.ImageUrl,
            recipe.AuthorId, AuthService.MapUser(author),
            recipe.CreatedAt, recipe.UpdatedAt, recipe.VoteScore, userVote, isSaved);
}
