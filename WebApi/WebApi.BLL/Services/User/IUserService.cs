using WebApi.BLL.DTOs.User;

namespace WebApi.BLL.Services.User;

public interface IUserService
{
    Task<ServiceResponse> CreateAsync(CreateUserDto dto);
    Task<ServiceResponse> UpdateAsync(UpdateUserDto dto);
    Task<ServiceResponse> DeleteAsync(string id);
    Task<ServiceResponse?> GetByIdAsync(string id);
    Task<ServiceResponse> GetAllAsync();
}
