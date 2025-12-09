using Microsoft.AspNetCore.Identity;
using WebApi.BLL.DTOs.Role;
using WebApi.DAL.Entities.Identity;
using Microsoft.EntityFrameworkCore;
using AutoMapper;

namespace WebApi.BLL.Services.Role;

public class RoleService(RoleManager<AppRole> roleManager, IMapper mapper) : IRoleService
{
    public async Task<ServiceResponse> CreateAsync(CreateRoleDto dto)
    {
        if (!await IsUniqueNameAsync(dto.Name))
        {
            return ServiceResponse.Error($"Роль з іменем {dto.Name} вже існує");
        }

        var entity = mapper.Map<AppRole>(dto);

        var result = await roleManager.CreateAsync(entity);
        entity.NormalizedName = dto.Name.ToUpper();

        if (result.Succeeded)
        {
            return ServiceResponse.Success($"Роль {entity.Name} успішно додано", dto);
        }
        return ServiceResponse.Error($"Не вдалося створити роль");
    }

    public async Task<ServiceResponse> DeleteAsync(long id)
    {
        var entity = await roleManager.FindByIdAsync(id.ToString());

        if (entity == null)
        {
            return ServiceResponse.Error($"Роль з id {id} не знайдено");
        }

        var result = await roleManager.DeleteAsync(entity);

        if (result.Succeeded)
        {
            return ServiceResponse.Success($"Роль {entity.Name} успішно видалено");
        }
        return ServiceResponse.Error($"Не вдалося видалити роль {entity.Name}");
    }

    public async Task<ServiceResponse> GetAllAsync()
    {
        var entities = await roleManager.Roles.ToListAsync();

        var dtos = mapper.Map<List<RoleDto>>(entities);

        return ServiceResponse.Success("Ролі успішно отримано", dtos);
    }

    public async Task<ServiceResponse> GetByIdAsync(long id)
    {
        var entity = await roleManager.FindByIdAsync(id.ToString());

        if (entity == null)
        {
            return ServiceResponse.Error($"Роль з id {id} не знайдено");
        }

        var dto = mapper.Map<RoleDto>(entity);

        return ServiceResponse.Success($"Роль {entity.Name} успішно отримано", dto);
    }

    public async Task<ServiceResponse> UpdateAsync(UpdateRoleDto dto)
    {
        var entity = mapper.Map<AppRole>(dto);

        if (!await IsUniqueNameAsync(dto.Name))
        {
            var existingRole = await roleManager.FindByNameAsync(dto.Name);
            if (existingRole != null && existingRole.Id != dto.Id)
            {
                return ServiceResponse.Error($"Роль з іменем {dto.Name} вже існує");
            }
        }

        var result = await roleManager.UpdateAsync(entity);

        if (result.Succeeded)
        {
            return ServiceResponse.Success($"Роль {entity.Name} успішно оновлено", dto);
        }
        return ServiceResponse.Error($"Не вдалося оновити роль {entity.Name}");
    }

    public async Task<bool> IsUniqueNameAsync(string name)
    {
        return !await roleManager.Roles
            .AnyAsync(c => c.NormalizedName == name.Trim().ToUpper());
    }
}
