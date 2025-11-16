using WebApi.BLL.DTOs.Account;

namespace WebApi.BLL.Services.Account;

public interface IAccountService
{
    Task<ServiceResponse> LoginAsync(LoginDto dto);
    Task<ServiceResponse?> RegisterAsync(RegisterDto dto);
}
