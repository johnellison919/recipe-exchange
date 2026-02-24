using Microsoft.EntityFrameworkCore;
using RecipeExchange.Api.Data;
using RecipeExchange.Api.Dtos;
using RecipeExchange.Api.Models;

namespace RecipeExchange.Api.Services;

public class VoteService(AppDbContext db, ILogger<VoteService> logger)
{
    public async Task<(VoteResponse? response, string? error)> Vote(string recipeId, string userId, string? voteType)
    {
        if (voteType is not null && voteType != "upvote" && voteType != "downvote")
            return (null, "Invalid vote type.");

        var recipe = await db.Recipes.FindAsync(recipeId);
        if (recipe is null) return (null, "not_found");

        var existing = await db.Votes
            .FirstOrDefaultAsync(v => v.RecipeId == recipeId && v.UserId == userId);

        if (voteType is null)
        {
            // Remove vote
            if (existing is not null)
            {
                recipe.VoteScore += existing.VoteType == "upvote" ? -1 : 1;
                db.Votes.Remove(existing);
            }
        }
        else if (existing is null)
        {
            // New vote
            db.Votes.Add(new Vote { UserId = userId, RecipeId = recipeId, VoteType = voteType });
            recipe.VoteScore += voteType == "upvote" ? 1 : -1;
        }
        else if (existing.VoteType == voteType)
        {
            // Same vote — toggle off
            recipe.VoteScore += existing.VoteType == "upvote" ? -1 : 1;
            db.Votes.Remove(existing);
            await db.SaveChangesAsync();
            return (new VoteResponse(null, recipe.VoteScore), null);
        }
        else
        {
            // Switch vote (upvote ↔ downvote)
            recipe.VoteScore += voteType == "upvote" ? 2 : -2;
            existing.VoteType = voteType;
        }

        await db.SaveChangesAsync();

        var currentVote = await db.Votes
            .Where(v => v.RecipeId == recipeId && v.UserId == userId)
            .Select(v => (string?)v.VoteType)
            .FirstOrDefaultAsync();

        return (new VoteResponse(currentVote, recipe.VoteScore), null);
    }
}
