using WebApi.BLL.DTOs.Account;
using WebApi.BLL.Models.Account;

namespace WebApi.BLL.Services.Account;

public interface IAccountService
{
    Task<ServiceResponse> LoginAsync(LoginModel dto);
    Task<ServiceResponse?> RegisterAsync(RegisterModel dto);
    Task<ServiceResponse> ConfirmEmailAsync(string userId, string token);
    Task<ServiceResponse> LoginByGoogleAsync(string token);
    public Task<ServiceResponse> ForgotPasswordAsync(ForgotPasswordDto dto);
    public Task<ServiceResponse> ValidateResetTokenAsync(ValidateResetTokenDto dto);
    public Task<ServiceResponse> ResetPasswordAsync(ResetPasswordDto dto);
    public Task<long> GetUserIdAsync();
    Task<ServiceResponse> UpdateProfileAsync(long userId, UpdateProfileDto dto);
    Task DeleteUserAsync(long userId);
}
