using WebApi.BLL.DTOs.Role;

namespace WebApi.BLL.Services.Role;

public interface IRoleService
{
    Task<ServiceResponse> CreateAsync(CreateRoleDto dto);
    Task<ServiceResponse> UpdateAsync(UpdateRoleDto dto);
    Task<ServiceResponse> DeleteAsync(long id);
    Task<ServiceResponse> GetByIdAsync(long id);
    Task<ServiceResponse> GetAllAsync();
}
