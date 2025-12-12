using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;
using System.Web;
using WebApi.BLL.DTOs.Account;
using WebApi.BLL.Services.Email;
using WebApi.BLL.Services.Image;
using WebApi.BLL.Services.JwtToken;
using WebApi.DAL.Entities.Identity;

namespace WebApi.BLL.Services.Account;

public class AccountService(UserManager<AppUser> userManager, IJwtTokenService jwtTokenService, IEmailService emailService, IConfiguration configuration, IImageService imageService) : IAccountService
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

        await emailService.SendMessageAsync(user.Email!, "Підтвердження електронної пошти", html, true);
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

    public async Task<ServiceResponse> LoginByGoogleAsync(string token)
    {
        try
        {
            using var httpClient = new HttpClient();
            httpClient.DefaultRequestHeaders.Authorization =
                new AuthenticationHeaderValue("Bearer", token);

            var userInfoUrl = configuration["GoogleUserInfo"]
                              ?? "https://www.googleapis.com/oauth2/v3/userinfo";

            var response = await httpClient.GetAsync(userInfoUrl);
            if (!response.IsSuccessStatusCode)
                return ServiceResponse.Error("Недійсний токен Google.");

            var json = await response.Content.ReadAsStringAsync();

            var options = new JsonSerializerOptions { PropertyNameCaseInsensitive = true };
            var googleUser = JsonSerializer.Deserialize<GoogleAccountDto>(json, options);

            if (googleUser == null || string.IsNullOrWhiteSpace(googleUser.Email))
                return ServiceResponse.Error("Не вдалося отримати інформацію про користувача з Google.");

            var existingUser = await userManager.FindByEmailAsync(googleUser.Email);
            if (existingUser != null)
            {
                if (!string.IsNullOrWhiteSpace(googleUser.GoogleId))
                {
                    var userLoginGoogle = await userManager.FindByLoginAsync("Google", googleUser.GoogleId);
                    if (userLoginGoogle == null)
                    {
                        await userManager.AddLoginAsync(existingUser,
                            new UserLoginInfo("Google", googleUser.GoogleId, "Google"));
                    }
                }
                var existingUserJwtToken = await jwtTokenService.GenerateTokenAsync(existingUser);
                return ServiceResponse.Success("Успішний вхід через Google.", existingUserJwtToken);
            }

            var user = new AppUser
            {
                Email = googleUser.Email,
                UserName = googleUser.Email,
                FirstName = googleUser.Name
            };

            if (!string.IsNullOrWhiteSpace(googleUser.Picture))
            {
                try
                {
                    user.Image = await imageService.SaveImageFromUrlAsync(googleUser.Picture, Settings.UsersDir);
                }
                catch
                {

                }
            }

            var createRes = await userManager.CreateAsync(user);
            if (!createRes.Succeeded)
                return ServiceResponse.Error("Не вдалося створити користувача.");

            if (!string.IsNullOrWhiteSpace(googleUser.GoogleId))
            {
                await userManager.AddLoginAsync(user, new UserLoginInfo(
                    loginProvider: "Google",
                    providerKey: googleUser.GoogleId,
                    displayName: "Google"
                ));
            }

            var jwtToken = await jwtTokenService.GenerateTokenAsync(user);
            return ServiceResponse.Success("Успішний вхід через Google.", jwtToken);
        }
        catch (Exception ex)
        {
            return ServiceResponse.Error($"Помилка при вході через Google: {ex.Message}");
        }
    }

    public async Task<ServiceResponse> ForgotPasswordAsync(ForgotPasswordDto dto)
    { 
        var user = await userManager.FindByEmailAsync(dto.Email);
        if (user is null)
            return ServiceResponse.Error("Користувача з такою електронною поштою не знайдено");

        // 1. Генерація токена
        var token = await userManager.GeneratePasswordResetTokenAsync(user);
        //byte[] bytes = Encoding.UTF8.GetBytes(token);
        //var encodedToken = Convert.ToBase64String(bytes);

        // 2. Кодуємо токен для URL (ЦЕ ПРАВИЛЬНО)
        var encodedToken = HttpUtility.UrlEncode(token);

        // 3. Завантажуємо HTML-шаблон
        string htmlPath = Path.Combine(Settings.RootPath ?? "/", "templates", "html", "reset_password.html");
        string html = File.ReadAllText(htmlPath);

        // 4. Формуємо URL з токеном
        string url = $"http://localhost:5172/reset-password?email={user.Email}&token={encodedToken}";

        // 5. Підставляємо action_url у HTML
        html = html.Replace("action_url", url);

        // 6. Відправляємо лист
        await emailService.SendMessageAsync(user.Email!, "Скидання пароля", html, true);

        return ServiceResponse.Success("Лист для скидання пароля успішно надіслано");
    }

    public async Task<ServiceResponse> ValidateResetTokenAsync(ValidateResetTokenDto dto)
    {
        var user = await userManager.FindByEmailAsync(dto.Email);
        if (user is null)
            return ServiceResponse.Error("Користувача з такою електронною поштою не знайдено");

        // Розкодовуємо Base64 назад у токен
        var token = HttpUtility.UrlDecode(dto.Token);
        //byte[] tokenBytes = Convert.FromBase64String(dto.Token);
        //var token = Encoding.UTF8.GetString(tokenBytes);

        var isValid = await userManager.VerifyUserTokenAsync(
            user,
            TokenOptions.DefaultProvider,
            "ResetPassword",
            token 
        );

        if (!isValid)
            return ServiceResponse.Error("Токен недійсний або прострочений");

        return ServiceResponse.Success("Токен валідний");
    }

    public async Task<ServiceResponse> ResetPasswordAsync(ResetPasswordDto dto)
    {
        var user = await userManager.FindByEmailAsync(dto.Email);
        if (user is null)
            return ServiceResponse.Error("Користувача з такою електронною поштою не знайдено");

        // Декодуємо токен
        var token = HttpUtility.UrlDecode(dto.Token);

        var result = await userManager.ResetPasswordAsync(user, token, dto.NewPassword);

        if (!result.Succeeded)
        {
            var errors = string.Join("; ", result.Errors.Select(e => e.Description));
            return ServiceResponse.Error("Не вдалося скинути пароль: " + errors);
        }

        return ServiceResponse.Success("Пароль успішно змінено");
    }

    public sealed class GoogleAccountDto
    {
        public string? Sub { get; set; }
        public string? Email { get; set; }
        public string? Name { get; set; }
        public string? Picture { get; set; }

        // зручно звести до однієї властивості
        public string? GoogleId => !string.IsNullOrWhiteSpace(Sub) ? Sub : null;
    }
}
