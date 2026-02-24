using System.ComponentModel.DataAnnotations;

namespace RecipeExchange.Api.Dtos;

public record VoteRequest(
    [RegularExpression("^(upvote|downvote)$", ErrorMessage = "VoteType must be 'upvote' or 'downvote'.")] string? VoteType);

public record VoteResponse(string? VoteType, int VoteScore);
