using Microsoft.EntityFrameworkCore;
using RecipeExchange.Api.Data;
using RecipeExchange.Api.Dtos;
using RecipeExchange.Api.Models;

namespace RecipeExchange.Api.Services;

public class SavedRecipeService(AppDbContext db)
{
    public async Task<SaveRecipeResponse?> ToggleSave(string recipeId, string userId)
    {
        var recipe = await db.Recipes.FindAsync(recipeId);
        if (recipe is null) return null;

        var existing = await db.SavedRecipes
            .FirstOrDefaultAsync(s => s.UserId == userId && s.RecipeId == recipeId);

        if (existing is not null)
        {
            db.SavedRecipes.Remove(existing);
            await db.SaveChangesAsync();
            return new SaveRecipeResponse(false);
        }

        db.SavedRecipes.Add(new SavedRecipe { UserId = userId, RecipeId = recipeId });
        await db.SaveChangesAsync();
        return new SaveRecipeResponse(true);
    }

    public async Task<HashSet<string>> GetSavedRecipeIds(string userId)
    {
        var ids = await db.SavedRecipes
            .Where(s => s.UserId == userId)
            .Select(s => s.RecipeId)
            .ToListAsync();
        return ids.ToHashSet();
    }
}
