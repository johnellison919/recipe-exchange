using Microsoft.AspNetCore.Mvc;
using RecipeExchange.Api.Services;

namespace RecipeExchange.Api.Controllers;

[ApiController]
[Route("api/users")]
public class UsersController(AuthService authService) : ControllerBase
{
    [HttpGet("{username}")]
    public async Task<IActionResult> GetByUsername(string username)
    {
        var user = await authService.GetByUsername(username);
        if (user is null) return NotFound();
        return Ok(await authService.GetProfile(user));
    }
}
