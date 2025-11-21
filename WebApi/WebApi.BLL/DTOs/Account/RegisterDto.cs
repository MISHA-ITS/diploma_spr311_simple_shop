using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WebApi.BLL.DTOs.Account;

public class RegisterDto
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

    public string UserName { get; set; } = String.Empty;

    /// <summary>
    /// Електронна пошта користувача
    /// </summary>
    /// <example>admin@example.com</example>
    public string Email { get; set; } = String.Empty;

    /// <summary>
    /// Пароль пошта користувача
    /// </summary>
    /// <example>pass123?</example>
    public string Password { get; set; } = String.Empty;
    public IFormFile? ImageFile { get; set; } = null;
}
