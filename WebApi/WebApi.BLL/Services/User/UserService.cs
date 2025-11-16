using AutoMapper;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using WebApi.BLL.DTOs.User;
using WebApi.BLL.Services.Image;
using WebApi.DAL.Entities.Identity;

namespace WebApi.BLL.Services.User;

public class UserService(UserManager<AppUser> userManager, IMapper mapper, IImageService imageService) : IUserService
{
    public async Task<ServiceResponse> CreateAsync(CreateUserDto dto)
    {
        if (await userManager.FindByEmailAsync(dto.Email) != null)
        {
            return ServiceResponse.Error($"Користувач з електронною адресою {dto.Email} вже існує");
        }

        var user = mapper.Map<AppUser>(dto);

        if (dto.Image != null)
        {
            string? imageName = await imageService.SaveImageAsync(dto.Image, Settings.CategoriesDir);

            if (!string.IsNullOrEmpty(imageName))
            {
                user.Image = Settings.CategoriesDir + "/" + imageName;
            }
        }

        var result = await userManager.CreateAsync(user, dto.Password);

        if (result.Succeeded)
        {
            return ServiceResponse.Success($"Користувача {user.UserName} успішно додано", dto);
        }

        return ServiceResponse.Error($"Не вдалося створити користувача");
    }

    public async Task<ServiceResponse> DeleteAsync(string id)
    {
        var user = await userManager.FindByIdAsync(id);
        if (user == null)
        {
            return ServiceResponse.Error($"Користувача з Id {id} не знайдено");
        }

        var result = await userManager.DeleteAsync(user);

        if (result.Succeeded)
        {
            return ServiceResponse.Success($"Користувача {user.UserName} успішно видалено");
        }

        return ServiceResponse.Error($"Не вдалося видалити користувача");
    }

    public async Task<ServiceResponse> GetAllAsync()
    {
        var users = await userManager.Users.ToListAsync();

        var dtos = mapper.Map<List<UserDTO>>(users);

        return ServiceResponse.Success("Користувачів отримано", dtos);
    }

    public async Task<ServiceResponse?> GetByIdAsync(string id)
    {
        var user = await userManager.FindByIdAsync(id);

        if (user != null)
        {
            var dto = mapper.Map<UserDTO>(user);
            return ServiceResponse.Success($"Користувача з Id {id} отримано", dto);
        }

        return ServiceResponse.Error($"Користувача з Id {id} не знайдено");
    }

    public async Task<ServiceResponse> UpdateAsync(UpdateUserDto dto)
    {
        var user = await userManager.FindByIdAsync(dto.Id.ToString());

        if (user == null)
        {
            return ServiceResponse.Error($"Користувача з Id {dto.Id} не знайдено");
        }

        var existingUser = await userManager.FindByEmailAsync(dto.Email);

        if (existingUser != null && existingUser.Id != dto.Id)
        {
            return ServiceResponse.Error($"Користувач з електронною адресою {dto.Email} вже існує");
        }

        user = mapper.Map(dto, user);

        if (dto.Image != null)
        {
            string? imageName = await imageService.SaveImageAsync(dto.Image, Settings.UsersDir);

            if (!string.IsNullOrEmpty(user.Image))
            {
                imageService.DeleteImage(Path.Combine(Settings.UsersDir, user.Image));
            }

            if (!string.IsNullOrEmpty(user.Image))
            {
                user.Image = await imageService.SaveImageAsync(dto.Image, Settings.UsersDir);
            }
        }

        var result = await userManager.UpdateAsync(user);

        if (result.Succeeded)
        {
            return ServiceResponse.Success($"Користувача {user.UserName} успішно оновлено", dto);
        }

        return ServiceResponse.Error($"Не вдалося оновити користувача", dto);
    }
}
