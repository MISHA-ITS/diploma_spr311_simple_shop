using WebApi.BLL.DTOs.Account;
using WebApi.DAL.Entities.Identity;

namespace WebApi.BLL.Services.Account;

public interface IAccountService
{
    Task<AppUser> RegisterAsync(RegisterDto dto)
    {
        throw new NotImplementedException();
    }
}
