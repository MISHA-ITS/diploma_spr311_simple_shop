using WebApi.BLL.DTOs.Role;

namespace WebApi.BLL.Services.Role;

public interface IRoleService
{
    Task<bool> CreateAsync(CreateRoleDto dto);
    Task<bool> UpdateAsync(UpdateRoleDto dto);
    Task<bool> DeleteAsync(long id);
    Task<RoleDto?> GetByIdAsync(long id);
    Task<IEnumerable<RoleDto>> GetAllAsync();
}
