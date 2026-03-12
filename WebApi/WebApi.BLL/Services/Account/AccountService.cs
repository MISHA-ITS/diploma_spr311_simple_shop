using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json.Linq;
using System.Net.Http.Headers;
using System.Security.Claims;
using System.Text;
using System.Text.Json;
using System.Web;
using WebApi.BLL.DTOs.Account;
using WebApi.BLL.Models.Account;
using WebApi.BLL.Services.Email;
using WebApi.BLL.Services.Image;
using WebApi.BLL.Services.JwtToken;
using WebApi.BLL.Services.Role;
using WebApi.DAL.Entities.Identity;

namespace WebApi.BLL.Services.Account;

public class AccountService(UserManager<AppUser> userManager, 
    IJwtTokenService jwtTokenService, 
    IEmailService emailService, 
    IConfiguration configuration, 
    IImageService imageService,
    IHttpContextAccessor httpContextAccessor,
    ILogger<AccountService> logger) : IAccountService
{
    public async Task<ServiceResponse?> RegisterAsync(RegisterModel dto)
    {
        logger.LogInformation("Starting user registration. Email: {Email}, UserName: {UserName}", 
            dto.Email, dto.UserName);

        if (string.IsNullOrWhiteSpace(dto.Email))
        {
            return ServiceResponse.Error("Email є обовʼязковим");
        }

        if (!await IsUniqueEmailAsync(dto.Email))
        {
            logger.LogWarning("Registration failed. Email already exists: {Email}", dto.Email);
            return ServiceResponse.Error($"Адреса електронної пошти {dto.Email} вже існує");
        }

        if (!await IsUniqueNameAsync(dto.UserName))
        {
            logger.LogWarning("Registration failed. Username already exists: {UserName}", dto.UserName);
            return ServiceResponse.Error($"Ім'я {dto.UserName} вже існує");
        }

        string? avatarPath = null;

        if (dto.ImageFile != null)
        {
            avatarPath = await imageService.SaveImageAsync(dto.ImageFile, Settings.UsersDir);
        }

        var user = new AppUser
        {
            FirstName = dto.FirstName,
            LastName = dto.LastName,
            UserName = dto.UserName,
            PhoneNumber = dto.PhoneNumber,
            Email = dto.Email,
            Image = avatarPath
        };

        logger.LogDebug("Creating user entity for {UserName}", user.UserName);

        var result = await userManager.CreateAsync(user, dto.Password);

        if (result.Succeeded)
        {
            await userManager.AddToRoleAsync(user, "User");

            logger.LogInformation("User successfully created. UserId: {UserId}, Email: {Email}", 
                user.Id, user.Email);

            await SendEmailConfirmMessageAsync(user);
            logger.LogInformation("Confirmation email sent. UserId: {UserId}", user.Id);

            string jwtToken = await jwtTokenService.GenerateTokenAsync(user);
            logger.LogInformation("JWT token generated for UserId: {UserId}", user.Id);

            return ServiceResponse.Success("Реєтрація успішна", jwtToken);
        }

        var error = result.Errors.First();
        logger.LogError("User registration failed. Email: {Email}, ErrorCode: {Code}, Error: {Error}", 
            dto.Email, error.Code, error.Description);

        return ServiceResponse.Error(error.Description);
    }

    private async Task SendEmailConfirmMessageAsync(AppUser user)
    {
        logger.LogInformation("Starting email confirmation message sending. UserId: {UserId}, Email: {Email}", 
            user.Id, user.Email);

        var token = await userManager.GenerateEmailConfirmationTokenAsync(user);
        logger.LogDebug("Email confirmation token generated for UserId: {UserId}", user.Id);

        byte[] bytes = Encoding.UTF8.GetBytes(token);
        token = Convert.ToBase64String(bytes);

        string htmlPath = Path.Combine(Settings.RootPath ?? "/", "templates", "html", "confirm_emaill.html");

        if (!File.Exists(htmlPath))
        {
            logger.LogError("Email confirmation template not found. Path: {Path}", htmlPath);
            throw new FileNotFoundException("Email template not found", htmlPath);
        }

        string html = File.ReadAllText(htmlPath);
        string url = $"http://localhost:5172/api/account/confirmEmail?userId={user.Id}&token={token}";
        html = html.Replace("action_url", url);

        await emailService.SendMessageAsync(user.Email!, "Підтвердження електронної пошти", html, true);
        logger.LogInformation("Email confirmation message successfully sent. UserId: {UserId}, Email: {Email}", 
            user.Id, user.Email);
    }

    public async Task<ServiceResponse> ConfirmEmailAsync(string userId, string token)
    {
        logger.LogInformation("Starting email confirmation. UserId: {UserId}", userId);

        if (string.IsNullOrWhiteSpace(userId) || string.IsNullOrWhiteSpace(token))
        {
            logger.LogWarning("Email confirmation failed due to invalid request data. UserId: {UserId}", userId);
            return ServiceResponse.Error("Невірний запит на підтвердження.");
        }

        var user = await userManager.FindByIdAsync(userId);

        if (user == null)
        {
            logger.LogWarning("Email confirmation failed. User not found. UserId: {UserId}", userId);
            return ServiceResponse.Error("Користувача не знайдено.");
        }

        try
        {
            byte[] bytes = Convert.FromBase64String(token);
            token = Encoding.UTF8.GetString(bytes);

            logger.LogDebug("Email confirmation token successfully decoded. UserId: {UserId}", userId);
        }
        catch (Exception ex)
        {
            logger.LogWarning(ex, "Invalid email confirmation token format. UserId: {UserId}", userId);
            return ServiceResponse.Error("Некоректний токен.");
        }

        var result = await userManager.ConfirmEmailAsync(user, token);

        if (!result.Succeeded)
        {
            logger.LogError("Email confirmation failed. UserId: {UserId}, Errors: {Errors}", 
                userId, result.Errors.Select(e => e.Description));
            return ServiceResponse.Error("Не вдалося підтвердити електронну пошту.");
        }

        logger.LogInformation("Email successfully confirmed. UserId: {UserId}, Email: {Email}", 
            user.Id, user.Email);

        return ServiceResponse.Success("Електронна пошта успішно підтверджена.");
    }

    public async Task<ServiceResponse> LoginAsync(LoginModel dto)
    {
        logger.LogInformation("Login attempt started. Email: {Email}", dto.Email);

        var user = await userManager.FindByEmailAsync(dto.Email);
        if (user == null)
        {
            logger.LogWarning("Login failed. User not found. Email: {Email}", dto.Email);
            return ServiceResponse.Error($"Користувача {dto.Email} не знайдено!");
        }

        var result = await userManager.CheckPasswordAsync(user, dto.Password);

        if (!result)
        {
            logger.LogWarning("Login failed. Invalid password. UserId: {UserId}, Email: {Email}", 
                user.Id, user.Email);
            return ServiceResponse.Error($"Неправильний пароль!");
        }

        // ✅ Перевірка підтвердження email
        if (!user.EmailConfirmed) // або IsEmailVerified, залежить від поля у твоїй моделі
        {
            logger.LogWarning("Login failed. Email not verified. UserId: {UserId}, Email: {Email}",
                user.Id, user.Email);
            return ServiceResponse.Error("Вхід можливий лише після підтвердження електронної пошти.");
        }

        string jwtToken = await jwtTokenService.GenerateTokenAsync(user);
        logger.LogInformation("Login successful. UserId: {UserId}, Email: {Email}", 
            user.Id, user.Email);

        return ServiceResponse.Success("Успішний вхід", jwtToken);
    }

    private async Task<bool> IsUniqueEmailAsync(string email)
    {
        if (string.IsNullOrWhiteSpace(email))
            throw new ArgumentException("Email is null or empty", nameof(email));

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
        logger.LogInformation("Google login attempt started");

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
            {
                logger.LogWarning("Google login failed. Invalid or expired Google token. StatusCode: {StatusCode}", 
                    response.StatusCode);
                return ServiceResponse.Error("Недійсний або прострочений токен Google.");
            }

            // Читаємо відповідь у JSON-форматі
            var json = await response.Content.ReadAsStringAsync();

            // Опції для десеріалізації — регістр символів не важливий
            var options = new JsonSerializerOptions { PropertyNameCaseInsensitive = true };
            // Перетворюємо JSON у GoogleAccountDto (email, name, picture, googleId)
            var googleUser = JsonSerializer.Deserialize<GoogleAccountDto>(json, options);

            // Перевірка: якщо Google не повернув email — це критична помилка
            if (googleUser == null || string.IsNullOrWhiteSpace(googleUser.Email))
            {
                logger.LogError("Google login failed. Google did not return email.");
                return ServiceResponse.Error("Не вдалося отримати інформацію про користувача з Google.");
            }

            logger.LogInformation("Google user info received. Email: {Email}", googleUser.Email);

            // Перевіряємо, чи існує користувач з таким email у нашій системі
            var existingUser = await userManager.FindByEmailAsync(googleUser.Email);
            
            if (existingUser != null)
            {
                logger.LogInformation("Existing user logging in via Google. UserId: {UserId}, Email: {Email}", 
                    existingUser.Id, existingUser.Email);
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

                        logger.LogInformation("Google login linked to existing user. UserId: {UserId}", existingUser.Id);
                    }
                }
                // Генеруємо JWT для існуючого користувача
                var existingUserJwtToken = await jwtTokenService.GenerateTokenAsync(existingUser);
                return ServiceResponse.Success("Успішний вхід через Google.", existingUserJwtToken);
            }

            logger.LogInformation("Creating new user from Google account. Email: {Email}", googleUser.Email);

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
                    logger.LogDebug("Google user avatar saved. Email: {Email}", googleUser.Email);
                }
                catch(Exception ex)
                {
                    logger.LogWarning(ex, "Failed to save Google user avatar. Email: {Email}", googleUser.Email);
                }
            }

            // Створюємо користувача в Identity
            var createRes = await userManager.CreateAsync(user);
            if (!createRes.Succeeded)
            {
                logger.LogError("Failed to create user from Google account. Email: {Email}, Errors: {Errors}", 
                    googleUser.Email, createRes.Errors.Select(e => e.Description));
                return ServiceResponse.Error("Не вдалося створити користувача.");
            }

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

            logger.LogInformation("New user successfully logged in via Google. UserId: {UserId}, Email: {Email}",
                user.Id, user.Email);

            return ServiceResponse.Success("Успішний вхід через Google.", jwtToken);
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Unexpected error during Google login");
            return ServiceResponse.Error($"Помилка при вході через Google: {ex.Message}");
        }
    }

    public async Task<ServiceResponse> ForgotPasswordAsync(ForgotPasswordDto dto)
    {
        logger.LogInformation("Forgot password request started. Email: {Email}", dto.Email);
        // Шукаємо користувача за email
        var user = await userManager.FindByEmailAsync(dto.Email);
        // Якщо користувача немає — далі немає сенсу перевіряти токен
        if (user is null)
        {
            logger.LogWarning("Forgot password failed. User not found. Email: {Email}", dto.Email);
            return ServiceResponse.Error("Користувача з такою електронною поштою не знайдено");
        }

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

        if (!File.Exists(htmlPath))
        {
            logger.LogError("Password reset template not found. Path: {Path}", htmlPath);
            throw new FileNotFoundException("Password reset template not found", htmlPath);
        }

        string html = File.ReadAllText(htmlPath);

        // Формуємо посилання для листа.
        // Саме за цим URL користувач відкриє форму скидання пароля (фронтенд або твоя сторінка).
        var appUrl = configuration["ClientAppUrl"];
        string url = $"{appUrl}/reset-password?email={user.Email}&token={encodedToken}";

        // Підставляємо action_url у HTML шаблон
        // У шаблоні має бути текст "action_url", який замінюється на справжній URL.
        html = html.Replace("action_url", url);

        // Надсилаємо email з готовим HTML.
        await emailService.SendMessageAsync(user.Email!, "Скидання пароля", html, true);

        logger.LogInformation("Forgot password email sent successfully. UserId: {UserId}, Email: {Email}",
            user.Id, user.Email);
        logger.LogInformation("Generated reset token for {Email}: {Token}", user.Email, token);
        logger.LogInformation("Reset URL: {Url}", url);

        // Повертаємо інформацію про успішну відправку.
        return ServiceResponse.Success("Лист для скидання пароля успішно надіслано");
    }

    public async Task<ServiceResponse> ValidateResetTokenAsync(ValidateResetTokenDto dto)
    {
        logger.LogInformation("Validate reset token request started. Email: {Email}", dto.Email);
        // Шукаємо користувача за email
        var user = await userManager.FindByEmailAsync(dto.Email);
        // Якщо користувача немає — далі немає сенсу перевіряти токен
        if (user is null)
        {
            logger.LogWarning("Validate reset token failed. User not found. Email: {Email}", dto.Email);
            return ServiceResponse.Error("Користувача з такою електронною поштою не знайдено");
        }

        // Декодуємо токен з URL-кодування (наприклад: %2B замість +, %2F замість /)
        // Це потрібно, оскільки токен проходить у query string, і браузер його автоматично кодує

        //byte[] tokenBytes = Convert.FromBase64String(dto.Token);
        //var token = Encoding.UTF8.GetString(tokenBytes);
        //var token = HttpUtility.UrlDecode(dto.Token);
        var token = dto.Token;

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
        {
            logger.LogWarning("Invalid or expired reset password token. UserId: {UserId}, Email: {Email}",
                user.Id, user.Email);
            return ServiceResponse.Error("Токен недійсний або прострочений");
        }

        logger.LogInformation("Reset password token is valid. UserId: {UserId}, Email: {Email}",
            user.Id, user.Email);
        // Все добре — Повертаємо інформацію про валідний токен
        return ServiceResponse.Success("Токен валідний");
    }

    public async Task<ServiceResponse> ResetPasswordAsync(ResetPasswordDto dto)
    {
        logger.LogInformation("Reset password attempt started. Email: {Email}", dto.Email);
        // Знаходимо користувача за email
        var user = await userManager.FindByEmailAsync(dto.Email);
        // Якщо не існує — немає сенсу продовжувати процедуру скидання
        if (user is null)
        {
            logger.LogWarning("Reset password failed. User not found. Email: {Email}", dto.Email);
            return ServiceResponse.Error("Користувача з такою електронною поштою не знайдено");
        }

        // Декодуємо токен скидання пароля з URL-кодування
        // Токен у вигляді Base64 потрапляє в URL, де символи типу +, /, = замінюються на (%2B, %2F, %3D)
        // HttpUtility.UrlDecode повертає оригінальний токен, який очікує Identity
        //var decodedToken = HttpUtility.UrlDecode(dto.Token);

        // Виконуємо скидання пароля
        var result = await userManager.ResetPasswordAsync(
            // 1. user — користувач, якому скидають пароль
            user,
            // 2. token — токен, який був згенерований GeneratePasswordResetTokenAsync
            dto.Token,
            // 3. dto.NewPassword — новий пароль, який хоче встановити користувач
            dto.NewPassword
            );

        // Якщо скидання пароля не вдалося — збираємо помилки та повертаємо їх
        if (!result.Succeeded)
        {
            // Об'єднуємо всі описання помилок у один текст
            var errors = string.Join("; ", result.Errors.Select(e => e.Description));
            logger.LogWarning("Reset password failed. UserId: {UserId}, Email: {Email}, Errors: {Errors}",
                user.Id, user.Email, errors);

            return ServiceResponse.Error("Не вдалося скинути пароль: " + errors);
        }

        logger.LogInformation("Password reset successful. UserId: {UserId}, Email: {Email}",
            user.Id, user.Email);

        // Якщо все успішно — пароль змінено
        return ServiceResponse.Success("Пароль успішно змінено");
    }

    public async Task<long> GetUserIdAsync()
    {
        var email = httpContextAccessor.HttpContext?
            .User?
            .FindFirst(ClaimTypes.Email)?.Value;

        if (string.IsNullOrEmpty(email))
            throw new UnauthorizedAccessException("User is not authenticated");

        var user = await userManager.FindByEmailAsync(email);

        return user.Id;
    }

    public async Task<ServiceResponse> UpdateProfileAsync(long userId, UpdateProfileDto dto)
    {
        var user = await userManager.FindByIdAsync(userId.ToString());

        if (user == null)
            return ServiceResponse.Error("User not found");

        user.FirstName = dto.FirstName;
        user.LastName = dto.LastName;
        user.PhoneNumber = dto.PhoneNumber;

        // якщо є картинка
        if (dto.Image != null)
        {
            var imageUrl = await imageService.SaveImageAsync(dto.Image, Settings.UsersDir);
            user.Image = imageUrl;
        }

        var result = await userManager.UpdateAsync(user);

        if (!result.Succeeded)
            return ServiceResponse.Error("Failed to update profile");

        return ServiceResponse.Success("Profile updated", user);
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
