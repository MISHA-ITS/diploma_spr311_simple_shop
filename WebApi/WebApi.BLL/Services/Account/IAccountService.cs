using WebApi.BLL.DTOs.Account;

namespace WebApi.BLL.Services.Account;

public interface IAccountService
{
    Task<ServiceResponse> LoginAsync(LoginDto dto);
    Task<ServiceResponse?> RegisterAsync(RegisterDto dto);
    Task<ServiceResponse> ConfirmEmailAsync(string userId, string token);
    Task<ServiceResponse> LoginByGoogleAsync(string token);
    public Task<ServiceResponse> ForgotPasswordAsync(ForgotPasswordDto dto);
    public Task<ServiceResponse> ValidateResetTokenAsync(ValidateResetTokenDto dto);
    public Task<ServiceResponse> ResetPasswordAsync(ResetPasswordDto dto);
    Task<long> GetUserIdAsync();
}
