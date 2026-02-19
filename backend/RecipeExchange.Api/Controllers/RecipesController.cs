using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using RecipeExchange.Api.Dtos;
using RecipeExchange.Api.Models;
using RecipeExchange.Api.Services;
using System.Security.Claims;

namespace RecipeExchange.Api.Controllers;

[ApiController]
[Route("api/recipes")]
public class RecipesController(RecipeService recipeService, VoteService voteService, SavedRecipeService savedRecipeService) : ControllerBase
{
    [HttpGet("categories")]
    public IActionResult GetCategories()
    {
        var categories = Enum.GetNames<RecipeCategory>()
            .Select(n => n.ToLower())
            .ToArray();
        return Ok(categories);
    }

    [HttpGet]
    public async Task<IActionResult> GetAll([FromQuery] string? authorId)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        return Ok(await recipeService.GetAll(userId, authorId));
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(string id)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        var recipe = await recipeService.GetById(id, userId);
        return recipe is null ? NotFound() : Ok(recipe);
    }

    [Authorize]
    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateRecipeRequest request)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)!;
        var recipe = await recipeService.Create(request, userId);
        return CreatedAtAction(nameof(GetById), new { id = recipe.Id }, recipe);
    }

    [Authorize]
    [HttpPut("{id}")]
    public async Task<IActionResult> Update(string id, [FromBody] UpdateRecipeRequest request)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)!;
        var (result, error) = await recipeService.Update(id, request, userId);
        return error switch
        {
            "not_found" => NotFound(),
            "forbidden" => Forbid(),
            _ => Ok(result)
        };
    }

    [Authorize]
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(string id)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)!;
        var error = await recipeService.Delete(id, userId);
        return error switch
        {
            "not_found" => NotFound(),
            "forbidden" => Forbid(),
            _ => NoContent()
        };
    }

    [Authorize]
    [HttpPost("{id}/vote")]
    public async Task<IActionResult> Vote(string id, [FromBody] VoteRequest request)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)!;
        var result = await voteService.Vote(id, userId, request.VoteType);
        return result is null ? NotFound() : Ok(result);
    }

    [Authorize]
    [HttpPost("{id}/save")]
    public async Task<IActionResult> ToggleSave(string id)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)!;
        var result = await savedRecipeService.ToggleSave(id, userId);
        return result is null ? NotFound() : Ok(result);
    }

    [Authorize]
    [HttpGet("saved")]
    public async Task<IActionResult> GetSaved()
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)!;
        return Ok(await recipeService.GetSaved(userId));
    }
}
