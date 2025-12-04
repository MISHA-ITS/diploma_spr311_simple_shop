namespace WebApi.BLL.Services.Email;

public interface IEmailService
{
    Task SendMessageAsync(string to, string subject, string body, bool isHtml = true);
}
