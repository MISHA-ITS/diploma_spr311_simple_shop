using Microsoft.AspNetCore.Identity;
using WebApi.BLL.DTOs.Role;
using WebApi.DAL.Entities.Identity;
using Microsoft.EntityFrameworkCore;

namespace WebApi.BLL.Services.Role;

public class RoleService(RoleManager<AppRole> roleManager) : IRoleService
{
    public async Task<bool> CreateAsync(CreateRoleDto dto)
    {
        var entity = new AppRole
        {
            Name = dto.Name
        };
        var result = await roleManager.CreateAsync(entity);
        return result.Succeeded;
    }

    public async Task<bool> DeleteAsync(long id)
    {
        var entity = await roleManager.FindByIdAsync(id.ToString());
        if (entity == null)
        {
            return false;
        }
        var result = await roleManager.DeleteAsync(entity);
        return result.Succeeded;
    }

    public async Task<IEnumerable<RoleDto>> GetAllAsync()
    {
        var entities = await roleManager.Roles.ToListAsync();

        var dtos = entities.Select(e => new RoleDto
        {
            Id = e.Id,
            Name = e.Name ?? "Noname"
        });

        return dtos;
    }

    public async Task<RoleDto?> GetByIdAsync(long id)
    {
        var entity = await roleManager.FindByIdAsync(id.ToString());

        if (entity == null)
        {
            return null;
        }

        var dto = new RoleDto
        {
            Id = entity.Id,
            Name = entity.Name ?? "Noname"
        };

        return dto;
    }

    public async Task<bool> UpdateAsync(UpdateRoleDto dto)
    {
        var entity = new AppRole
        {
            Id = dto.Id,
            Name = dto.Name
        };

        var result = await roleManager.UpdateAsync(entity);
        return result.Succeeded;
    }
}
