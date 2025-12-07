using WebApi.BLL.DTOs.Account;

namespace WebApi.BLL.Services.Account;

public interface IAccountService
{
    Task<ServiceResponse> LoginAsync(LoginDto dto);
    Task<ServiceResponse?> RegisterAsync(RegisterDto dto);
    Task<ServiceResponse> ConfirmEmailAsync(string userId, string token);
    Task<ServiceResponse> LoginByGoogleAsync(string token);
}
