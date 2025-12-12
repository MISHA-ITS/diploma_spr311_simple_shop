using MailKit.Net.Smtp;
using MailKit.Security;
using Microsoft.Extensions.Options;
using MimeKit;
using WebApi.BLL.Configuration;

namespace WebApi.BLL.Services.Email;

public class EmailService(IOptions<EmailSettings> options) : IEmailService
{
    private readonly EmailSettings settings = options.Value;

    public async Task SendMessageAsync(string to, string subject, string body, bool isHtml = false)
    {
        var email = new MimeMessage();
        email.From.Add(MailboxAddress.Parse(settings.UserEmail));
        email.To.Add(MailboxAddress.Parse(to));
        email.Subject = subject;

        email.Body = new TextPart(isHtml ? "html" : "plain")
        {
            Text = body
        };

        using var smtp = new SmtpClient();

        await smtp.ConnectAsync(
            settings.SmtpHost,
            settings.SmtpPort,
            SecureSocketOptions.StartTls
        );

        await smtp.AuthenticateAsync(settings.UserEmail, settings.Password);

        await smtp.SendAsync(email);
        await smtp.DisconnectAsync(true);
    }
}