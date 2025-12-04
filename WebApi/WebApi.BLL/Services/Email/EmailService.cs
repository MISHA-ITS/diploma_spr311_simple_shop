using MailKit.Net.Smtp;
using MailKit.Security;
using Microsoft.Extensions.Options;
using MimeKit;
using WebApi.BLL.Configuration;

namespace WebApi.BLL.Services.Email;

public class EmailService : IEmailService
{
    private readonly EmailSettings _settings;

    public EmailService(IOptions<EmailSettings> options)
    {
        _settings = options.Value;
    }

    public async Task SendMessageAsync(string to, string subject, string body, bool isHtml = false)
    {
        var email = new MimeMessage();
        email.From.Add(MailboxAddress.Parse(_settings.UserEmail));
        email.To.Add(MailboxAddress.Parse(to));
        email.Subject = subject;

        email.Body = new TextPart(isHtml ? "html" : "plain")
        {
            Text = body
        };

        using var smtp = new SmtpClient();

        await smtp.ConnectAsync(
            _settings.SmtpHost,
            _settings.SmtpPort,
            SecureSocketOptions.StartTls
        );

        await smtp.AuthenticateAsync(_settings.UserEmail, _settings.Password);

        await smtp.SendAsync(email);
        await smtp.DisconnectAsync(true);
    }
}