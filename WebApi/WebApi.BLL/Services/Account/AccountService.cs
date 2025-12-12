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
            // Створюємо HTTP-клієнт для запиту до Google API
            using var httpClient = new HttpClient();
            // Додаємо токен у заголовок Authorization (Bearer <token>)
            // Це дозволяє Google API ідентифікувати користувача
            httpClient.DefaultRequestHeaders.Authorization =
                new AuthenticationHeaderValue("Bearer", token);

            // URL для отримання даних профілю Google
            // Якщо не заданий у конфігурації — беремо дефолтний
            var userInfoUrl = configuration["GoogleUserInfo"]
                              ?? "https://www.googleapis.com/oauth2/v3/userinfo";

            // Виконуємо GET-запит до Google UserInfo API
            var response = await httpClient.GetAsync(userInfoUrl);
            // Якщо статус неуспішний — токен недійсний або прострочений
            if (!response.IsSuccessStatusCode)
                return ServiceResponse.Error("Недійсний або прострочений токен Google.");

            // Читаємо відповідь у JSON-форматі
            var json = await response.Content.ReadAsStringAsync();

            // Опції для десеріалізації — регістр символів не важливий
            var options = new JsonSerializerOptions { PropertyNameCaseInsensitive = true };
            // Перетворюємо JSON у GoogleAccountDto (email, name, picture, googleId)
            var googleUser = JsonSerializer.Deserialize<GoogleAccountDto>(json, options);

            // Перевірка: якщо Google не повернув email — це критична помилка
            if (googleUser == null || string.IsNullOrWhiteSpace(googleUser.Email))
                return ServiceResponse.Error("Не вдалося отримати інформацію про користувача з Google.");

            // Перевіряємо, чи існує користувач з таким email у нашій системі
            var existingUser = await userManager.FindByEmailAsync(googleUser.Email);
            
            if (existingUser != null)
            {
                // Якщо Google повернув свій GoogleId — перевіряємо логіни
                if (!string.IsNullOrWhiteSpace(googleUser.GoogleId))
                {
                    // Перевіряємо, чи прив'язаний Google акаунт до цього користувача
                    var userLoginGoogle = await userManager.FindByLoginAsync("Google", googleUser.GoogleId);
                    // Якщо прив’язки ще немає — додаємо її
                    if (userLoginGoogle == null)
                    {
                        await userManager.AddLoginAsync(existingUser,
                            new UserLoginInfo("Google", googleUser.GoogleId, "Google"));
                    }
                }
                // Генеруємо JWT для існуючого користувача
                var existingUserJwtToken = await jwtTokenService.GenerateTokenAsync(existingUser);
                return ServiceResponse.Success("Успішний вхід через Google.", existingUserJwtToken);
            }

            // Якщо користувача немає — створюємо нового
            var user = new AppUser
            {
                Email = googleUser.Email,
                UserName = googleUser.Email, // В якості username використовуємо email
                FirstName = googleUser.Name  // Ім'я з Google
            };

            // Якщо в Google є аватар — завантажуємо і зберігаємо його
            if (!string.IsNullOrWhiteSpace(googleUser.Picture))
            {
                try
                {
                    // Завантажуємо фото на сервер у каталог користувачів
                    user.Image = await imageService.SaveImageFromUrlAsync(googleUser.Picture, Settings.UsersDir);
                }
                catch
                {
                    // Якщо збереження фото не вдалося — не перериваємо логіку
                }
            }

            // Створюємо користувача в Identity
            var createRes = await userManager.CreateAsync(user);
            if (!createRes.Succeeded)
                return ServiceResponse.Error("Не вдалося створити користувача.");

            // Якщо є GoogleId — додаємо прив’язку «LoginProvider: Google»
            if (!string.IsNullOrWhiteSpace(googleUser.GoogleId))
            {
                await userManager.AddLoginAsync(user, new UserLoginInfo(
                    loginProvider: "Google",
                    providerKey: googleUser.GoogleId,
                    displayName: "Google"
                ));
            }

            // Генеруємо JWT для нового користувача
            var jwtToken = await jwtTokenService.GenerateTokenAsync(user);
            return ServiceResponse.Success("Успішний вхід через Google.", jwtToken);
        }
        catch (Exception ex)
        {
            // Ловимо всі інші помилки, щоб не зламати програму
            return ServiceResponse.Error($"Помилка при вході через Google: {ex.Message}");
        }
    }

    public async Task<ServiceResponse> ForgotPasswordAsync(ForgotPasswordDto dto)
    {
        // Шукаємо користувача за email
        var user = await userManager.FindByEmailAsync(dto.Email);
        // Якщо користувача немає — далі немає сенсу перевіряти токен
        if (user is null)
            return ServiceResponse.Error("Користувача з такою електронною поштою не знайдено");

        // Генеруємо токен для скидання пароля.
        // Це довгий рядок з символами (+, =, /), які ламаються у URL.
        var token = await userManager.GeneratePasswordResetTokenAsync(user);
        //byte[] bytes = Encoding.UTF8.GetBytes(token);
        //var encodedToken = Convert.ToBase64String(bytes);

        // Кодуємо токен спеціально для передачі через URL.
        // HttpUtility.UrlEncode — правильний спосіб, бо він конвертує всі небезпечні символи у %XX.
        // Увага: не потрібно робити Base64 вручну — Identity вже повертає правильну форму токена.
        var encodedToken = HttpUtility.UrlEncode(token);

        // Завантажуємо HTML шаблон листа.
        // Шаблон містить місце для посилання (action_url), яке ми нижче замінимо.
        string htmlPath = Path.Combine(Settings.RootPath ?? "/", "templates", "html", "reset_password.html");
        string html = File.ReadAllText(htmlPath);

        // Формуємо посилання для листа.
        // Саме за цим URL користувач відкриє форму скидання пароля (фронтенд або твоя сторінка).
        string url = $"http://localhost:5172/reset-password?email={user.Email}&token={encodedToken}";

        // Підставляємо action_url у HTML шаблон
        // У шаблоні має бути текст "action_url", який замінюється на справжній URL.
        html = html.Replace("action_url", url);

        // Надсилаємо email з готовим HTML.
        await emailService.SendMessageAsync(user.Email!, "Скидання пароля", html, true);

        // Повертаємо інформацію про успішну відправку.
        return ServiceResponse.Success("Лист для скидання пароля успішно надіслано");
    }

    public async Task<ServiceResponse> ValidateResetTokenAsync(ValidateResetTokenDto dto)
    {
        // Шукаємо користувача за email
        var user = await userManager.FindByEmailAsync(dto.Email);
        // Якщо користувача немає — далі немає сенсу перевіряти токен
        if (user is null)
            return ServiceResponse.Error("Користувача з такою електронною поштою не знайдено");

        // Декодуємо токен з URL-кодування (наприклад: %2B замість +, %2F замість /)
        // Це потрібно, оскільки токен проходить у query string, і браузер його автоматично кодує
        var token = HttpUtility.UrlDecode(dto.Token);
        //byte[] tokenBytes = Convert.FromBase64String(dto.Token);
        //var token = Encoding.UTF8.GetString(tokenBytes);

        // Перевіряємо токен скидання пароля
        var isValid = await userManager.VerifyUserTokenAsync(
            // 1. user — користувач, для якого токен створювали
            user,
            // 2. TokenOptions.DefaultProvider — стандартний провайдер токенів Identity
            TokenOptions.DefaultProvider,
            // 3. "ResetPassword" — тип токена, який створювався методом GeneratePasswordResetTokenAsync
            "ResetPassword",
            // 4. token — розкодований токен
            token
        );

        // Якщо токен невалідний або його термін дії вичерпано
        if (!isValid)
            return ServiceResponse.Error("Токен недійсний або прострочений");
        // Все добре — Повертаємо інформацію про валідний токен
        return ServiceResponse.Success("Токен валідний");
    }

    public async Task<ServiceResponse> ResetPasswordAsync(ResetPasswordDto dto)
    {
        // Знаходимо користувача за email
        var user = await userManager.FindByEmailAsync(dto.Email);
        // Якщо не існує — немає сенсу продовжувати процедуру скидання
        if (user is null)
            return ServiceResponse.Error("Користувача з такою електронною поштою не знайдено");

        // Декодуємо токен скидання пароля з URL-кодування
        // Токен у вигляді Base64 потрапляє в URL, де символи типу +, /, = замінюються на (%2B, %2F, %3D)
        // HttpUtility.UrlDecode повертає оригінальний токен, який очікує Identity
        var token = HttpUtility.UrlDecode(dto.Token);

        // Виконуємо скидання пароля
        var result = await userManager.ResetPasswordAsync(
            // 1. user — користувач, якому скидають пароль
            user,
            // 2. token — токен, який був згенерований GeneratePasswordResetTokenAsync
            token,
            // 3. dto.NewPassword — новий пароль, який хоче встановити користувач
            dto.NewPassword
            );

        // Якщо скидання пароля не вдалося — збираємо помилки та повертаємо їх
        if (!result.Succeeded)
        {
            // Об'єднуємо всі описання помилок у один текст
            var errors = string.Join("; ", result.Errors.Select(e => e.Description));
            return ServiceResponse.Error("Не вдалося скинути пароль: " + errors);
        }
        // Якщо все успішно — пароль змінено
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
