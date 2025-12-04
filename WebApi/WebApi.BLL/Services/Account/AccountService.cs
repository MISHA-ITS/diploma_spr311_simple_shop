using Microsoft.AspNetCore.Identity;
using WebApi.BLL.Services.Email;
using System.Text;
using WebApi.BLL.DTOs.Account;
using WebApi.BLL.Services.JwtToken;
using WebApi.DAL.Entities.Identity;


namespace WebApi.BLL.Services.Account;

public class AccountService(UserManager<AppUser> userManager, IJwtTokenService jwtTokenService, IEmailService emailService) : IAccountService
{
    public async Task<ServiceResponse?> RegisterAsync(RegisterDto dto)
    {
        if (!await IsUniqueEmailAsync(dto.Email))
        {
            return ServiceResponse.Error($"Адреса електронної пошти {dto.Email} вже існує");
        }

        if (!await IsUniqueNameAsync(dto.UserName))
        {
            return ServiceResponse.Error($"Ім'я {dto.UserName} вже існує");
        }

        var user = new AppUser
        {
            FirstName = dto.FirstName,
            LastName = dto.LastName,
            UserName = dto.UserName,
            Email = dto.Email
        };

        var result = await userManager.CreateAsync(user, dto.Password);

        if (result.Succeeded)
        {
            await SendEmailConfirmMessageAsync(user);

            string jwtToken = await jwtTokenService.GenerateTokenAsync(user);

            return ServiceResponse.Success("Реєтрація успішна", jwtToken);
        }

        return ServiceResponse.Error(result.Errors.First().Description);
    }

    private async Task SendEmailConfirmMessageAsync(AppUser user)
    {
        var token = await userManager.GenerateEmailConfirmationTokenAsync(user);
        byte[] bytes = Encoding.UTF8.GetBytes(token);
        token = Convert.ToBase64String(bytes);

        string htmlPath = Path.Combine(Settings.RootPath ?? "/", "templates", "html", "confirm_emaill.html");
        string html = File.ReadAllText(htmlPath);
        string url = $"http://localhost:5172/api/account/confirmEmail?userId={user.Id}&token={token}";
        html = html.Replace("action_url", url);

        await emailService.SendMessageAsync(user.Email, "Підтвердження електронної пошти", html);
    }

    public async Task<ServiceResponse> LoginAsync(LoginDto dto)
    {
        var user = await userManager.FindByEmailAsync(dto.Email);
        if (user == null)
        {
            return ServiceResponse.Error($"Користувача {dto.Email} не знайдено!");
        }

        var result = await userManager.CheckPasswordAsync(user, dto.Password);

        if (!result)
        {
            return ServiceResponse.Error($"Неправильний пароль!");
        }

        string jwtToken = await jwtTokenService.GenerateTokenAsync(user);

        return ServiceResponse.Success("Успішний вхід", jwtToken);
    }

    private async Task<bool> IsUniqueEmailAsync(string email)
    {
        var user = await userManager.FindByEmailAsync(email);
        return user == null;
    }

    private async Task<bool> IsUniqueNameAsync(string name)
    {
        var user = await userManager.FindByNameAsync(name);
        return user == null;
    }

    public async Task<ServiceResponse> ConfirmEmailAsync(string userId, string token)
    {
        if (string.IsNullOrWhiteSpace(userId) || string.IsNullOrWhiteSpace(token))
        {
            return ServiceResponse.Error("Невірний запит на підтвердження.");
        }

        var user = await userManager.FindByIdAsync(userId);

        if (user == null)
        {
            return ServiceResponse.Error("Користувача не знайдено.");
        }

        try
        {
            byte[] bytes = Convert.FromBase64String(token);
            token = Encoding.UTF8.GetString(bytes);
        }
        catch
        {
            return ServiceResponse.Error("Некоректний токен.");
        }

        var result = await userManager.ConfirmEmailAsync(user, token);

        if (!result.Succeeded)
        {
            return ServiceResponse.Error("Не вдалося підтвердити електронну пошту.");
        }

        return ServiceResponse.Success("Електронна пошта успішно підтверджена.");
    }
}
