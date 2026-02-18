namespace RecipeExchange.Api.Services;

public class VoteService(DbContext db)
{
    public async Task<VoteResponse?> Vote(string recipeId, string userId, string? voteType)
    {
        var recipe = await db.Recipes.FindAsync(recipeId);
        if (recipe is null) return null;

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
            return new VoteResponse(null, recipe.VoteScore);
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

        return new VoteResponse(currentVote, recipe.VoteScore);
    }
}
