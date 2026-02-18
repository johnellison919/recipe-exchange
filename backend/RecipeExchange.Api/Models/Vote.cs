namespace RecipeExchange.Api.Models;

public class Vote
{
    public string Id { get; set; } = Guid.NewGuid().ToString();
    public string UserId { get; set; } = string.Empty;
    public string RecipeId { get; set; } = string.Empty;
    public string VoteType { get; set; } = string.Empty; // "upvote" | "downvote"
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
