using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using RecipeExchange.Api.Dtos;
using RecipeExchange.Api.Models;
using RecipeExchange.Api.Services;
using System.Security.Claims;

namespace RecipeExchange.Api.Controllers;

[ApiController]
[Route("api/auth")]
public class AuthController(AuthService authService, EmailService emailService) : ControllerBase
{
    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequest request)
    {
        var (user, error) = await authService.ValidateLogin(request);
        if (error is not null)
            return Unauthorized(new { error });

        await HttpContext.SignInAsync(
            CookieAuthenticationDefaults.AuthenticationScheme,
            BuildPrincipal(user!));

        return Ok(AuthService.MapUser(user!));
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterRequest request)
    {
        var (token, error) = await authService.Register(request);
        if (error is not null)
            return BadRequest(new { error });

        await emailService.SendConfirmationEmail(request.Email, request.Username, token!);

        return Ok(new { message = "Registration successful! Please check your email to confirm your account." });
    }

    [HttpPost("confirm-email")]
    public async Task<IActionResult> ConfirmEmail([FromBody] ConfirmEmailRequest request)
    {
        var (success, error) = await authService.ConfirmEmail(request.Email, request.Token);
        if (!success)
            return BadRequest(new { error });

        return Ok(new { message = "Email confirmed successfully. You can now log in." });
    }

    [HttpPost("forgot-password")]
    public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordRequest request)
    {
        var (user, token) = await authService.RequestPasswordReset(request.Email);

        if (user is not null && token is not null)
            await emailService.SendPasswordResetEmail(request.Email, user.Username, token);

        return Ok(new { message = "If an account with that email exists, a password reset link has been sent." });
    }

    [HttpPost("reset-password")]
    public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordRequest request)
    {
        var (success, error) = await authService.ResetPassword(request.Email, request.Token, request.NewPassword);
        if (!success)
            return BadRequest(new { error });

        return Ok(new { message = "Password has been reset successfully. You can now log in." });
    }

    [HttpPost("resend-confirmation")]
    public async Task<IActionResult> ResendConfirmation([FromBody] ResendConfirmationRequest request)
    {
        var (user, token) = await authService.ResendConfirmation(request.Email);

        if (user is not null && token is not null)
            await emailService.SendConfirmationEmail(request.Email, user.Username, token);

        return Ok(new { message = "If your email is registered and unconfirmed, a new confirmation email has been sent." });
    }

    [Authorize]
    [HttpPost("change-email")]
    public async Task<IActionResult> ChangeEmail([FromBody] ChangeEmailRequest request)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)!;
        var (token, error) = await authService.RequestEmailChange(userId, request.NewEmail);
        if (error is not null)
            return BadRequest(new { error });

        var user = await authService.GetById(userId);
        await emailService.SendEmailChangeConfirmation(request.NewEmail, user!.Username, token!);

        return Ok(new { message = "A confirmation email has been sent to your new email address." });
    }

    [Authorize]
    [HttpPost("confirm-email-change")]
    public async Task<IActionResult> ConfirmEmailChange([FromBody] ConfirmEmailChangeRequest request)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)!;
        var (success, error) = await authService.ConfirmEmailChange(userId, request.Token);
        if (!success)
            return BadRequest(new { error });

        var user = await authService.GetById(userId);
        return Ok(new { message = "Email changed successfully.", user = AuthService.MapUser(user!) });
    }

    [Authorize]
    [HttpPost("change-password")]
    public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordRequest request)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)!;
        var (success, error) = await authService.ChangePassword(userId, request.CurrentPassword, request.NewPassword);
        if (!success)
            return BadRequest(new { error });

        return Ok(new { message = "Password changed successfully." });
    }

    [Authorize]
    [HttpPut("avatar")]
    public async Task<IActionResult> UpdateAvatar([FromBody] UpdateAvatarRequest request)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)!;
        var (success, error) = await authService.UpdateAvatar(userId, request.AvatarUrl);
        if (!success)
            return BadRequest(new { error });

        var user = await authService.GetById(userId);
        return Ok(AuthService.MapUser(user!));
    }

    [Authorize]
    [HttpPost("logout")]
    public async Task<IActionResult> Logout()
    {
        await HttpContext.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);
        return Ok();
    }

    [Authorize]
    [HttpGet("me")]
    public async Task<IActionResult> Me()
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)!;
        var user = await authService.GetById(userId);
        if (user is null) return NotFound();
        return Ok(await authService.GetProfile(user));
    }

    private static ClaimsPrincipal BuildPrincipal(User user)
    {
        var claims = new[]
        {
            new Claim(ClaimTypes.NameIdentifier, user.Id),
            new Claim(ClaimTypes.Email, user.Email),
            new Claim(ClaimTypes.Name, user.Username)
        };
        var identity = new ClaimsIdentity(claims, CookieAuthenticationDefaults.AuthenticationScheme);
        return new ClaimsPrincipal(identity);
    }
}
