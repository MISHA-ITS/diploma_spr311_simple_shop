using WebApi.DAL.Entities.Identity;
using WebApi.BLL.DTOs.Account;
using Microsoft.AspNetCore.Identity;

namespace WebApi.BLL.Services.Account;

public class AccountService(UserManager<AppUser> userManager) : IAccountService
{
    public async Task<AppUser?> RegisterAsync(RegisterDto dto)
    {
        if(!await IsUniqueEmailAsync(dto.Email))
        {
            return null;
        }

        var user = new AppUser
        {
            UserName = dto.UserName,
            Email = dto.Email,
            PhoneNumber = dto.PhoneNumber
        };

        var result = await userManager.CreateAsync(user, dto.Password);

        if (!result.Succeeded)
        {
            return null;
        }



        return user;
    }

    private async Task<bool> IsUniqueEmailAsync(string email)
    {
        var user = await userManager.FindByEmailAsync(email);
        return user == null;
    }
}
