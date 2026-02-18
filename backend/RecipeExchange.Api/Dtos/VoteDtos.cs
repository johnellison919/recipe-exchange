namespace RecipeExchange.Api.Dtos;

public record VoteRequest(string? VoteType); // "upvote" | "downvote" | null (removes vote)

public record VoteResponse(string? VoteType, int VoteScore);
