using Resend;

namespace RecipeExchange.Api.Services;

public class EmailService
{
    private readonly IResend _resend;
    private readonly string _fromEmail;
    private readonly string _fromName;
    private readonly string _frontendBaseUrl;

    public EmailService(IConfiguration configuration)
    {
        var apiKey = configuration["Resend:ApiKey"]
            ?? throw new InvalidOperationException("Resend:ApiKey is not configured.");
        _fromEmail = configuration["Resend:FromEmail"] ?? "noreply@example.com";
        _fromName = configuration["Resend:FromName"] ?? "Recipe Exchange";
        _frontendBaseUrl = configuration["FrontendBaseUrl"] ?? "http://localhost:4200";

        _resend = ResendClient.Create(new ResendClientOptions { ApiToken = apiKey }, new HttpClient());
    }

    public async Task SendConfirmationEmail(string toEmail, string username, string token)
    {
        var confirmUrl = $"{_frontendBaseUrl}/confirm-email?token={Uri.EscapeDataString(token)}&email={Uri.EscapeDataString(toEmail)}";

        var message = new EmailMessage
        {
            From = $"{_fromName} <{_fromEmail}>",
            To = [toEmail],
            Subject = "Confirm your Recipe Exchange account",
            HtmlBody = $"""
                <h2>Welcome to Recipe Exchange, {System.Net.WebUtility.HtmlEncode(username)}!</h2>
                <p>Please confirm your email address by clicking the link below:</p>
                <p><a href="{confirmUrl}">Confirm Email Address</a></p>
                <p>This link expires in 24 hours.</p>
                <p>If you did not create an account, you can ignore this email.</p>
                """
        };

        await _resend.EmailSendAsync(message);
    }

    public async Task SendPasswordResetEmail(string toEmail, string username, string token)
    {
        var resetUrl = $"{_frontendBaseUrl}/reset-password?token={Uri.EscapeDataString(token)}&email={Uri.EscapeDataString(toEmail)}";

        var message = new EmailMessage
        {
            From = $"{_fromName} <{_fromEmail}>",
            To = [toEmail],
            Subject = "Reset your Recipe Exchange password",
            HtmlBody = $"""
                <h2>Password Reset Request</h2>
                <p>Hi {System.Net.WebUtility.HtmlEncode(username)}, we received a request to reset your password.</p>
                <p><a href="{resetUrl}">Reset Password</a></p>
                <p>This link expires in 1 hour.</p>
                <p>If you did not request a password reset, you can ignore this email.</p>
                """
        };

        await _resend.EmailSendAsync(message);
    }
}
