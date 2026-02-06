using Microsoft.AspNetCore.Http;

namespace WebApi.BLL.Models.Account;

public class RegisterModel
{
    /// <summary>
    /// Ім'я користувача
    /// </summary>
    /// <example>name</example>
    public string FirstName { get; set; } = String.Empty;

    /// <summary>
    /// Прізвище користувача
    /// </summary>
    /// <example>surname</example>
    public string LastName { get; set; } = String.Empty;

    /// <summary>
    /// Користувача
    /// </summary>
    /// <example>admin@example.com</example>
    public string UserName { get; set; } = String.Empty;

    /// <summary>
    /// Номер телефону користувача
    /// </summary>
    /// <example>+380999999999</example>
    public string PhoneNumber { get; set; } = String.Empty;

    /// <summary>
    /// Електронна пошта користувача
    /// </summary>
    /// <example>admin@example.com</example>
    public string Email { get; set; } = String.Empty;

    /// <summary>
    /// Пароль користувача
    /// </summary>
    /// <example>Admin123!</example>
    public string Password { get; set; } = String.Empty;
    public IFormFile? ImageFile { get; set; } = null;
}
