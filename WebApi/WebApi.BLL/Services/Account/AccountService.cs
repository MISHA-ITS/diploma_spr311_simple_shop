using WebApi.DAL.Entities.Identity;
using WebApi.BLL.DTOs.Account;
using Microsoft.AspNetCore.Identity;
using WebApi.BLL.Services.JwtToken;

namespace WebApi.BLL.Services.Account;

public class AccountService(UserManager<AppUser> userManager, IJwtTokenService jwtTokenService) : IAccountService
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
            UserName = dto.UserName,
            Email = dto.Email
        };

        var result = await userManager.CreateAsync(user, dto.Password);

        if (result.Succeeded)
        {
            string jwtToken = await jwtTokenService.GenerateTokenAsync(user);

            return ServiceResponse.Success("Реєтрація успішна", jwtToken);
        }

        return ServiceResponse.Error(result.Errors.First().Description);
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
}
