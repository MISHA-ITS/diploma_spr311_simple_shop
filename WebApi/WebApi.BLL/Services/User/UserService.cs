using AutoMapper;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using WebApi.BLL.Constatnts;
using WebApi.BLL.DTOs.User;
using WebApi.BLL.Services.Image;
using WebApi.DAL.Entities.Identity;

namespace WebApi.BLL.Services.User;

public class UserService(UserManager<AppUser> userManager, IMapper mapper, IImageService imageService) : IUserService
{
    public async Task<ServiceResponse> CreateAsync(CreateUserDto dto)
    {
        if (await userManager.FindByEmailAsync(dto.Email) != null)
            return ServiceResponse.Error($"Користувач з електронною адресою {dto.Email} вже існує");

        var user = mapper.Map<AppUser>(dto);

        user.UserName = dto.Email.Split('@')[0];

        if (dto.Image != null)
        {
            string? imageName = await imageService.SaveImageAsync(dto.Image, Settings.UsersDir);

            if (!string.IsNullOrEmpty(imageName))
                user.Image = imageName;
        }

        var result = await userManager.CreateAsync(user, dto.Password);

        if (!result.Succeeded)
        {
            var errors = string.Join("; ", result.Errors.Select(e => e.Description));
            return ServiceResponse.Error($"Не вдалося створити користувача: {errors}");
        }
        var roleResult = await userManager.AddToRoleAsync(user, Roles.User);

        return ServiceResponse.Success($"Користувача {user.UserName} успішно доданота призначено роль User", dto);
    }

    public async Task<ServiceResponse> DeleteAsync(string id)
    {
        var user = await userManager.FindByIdAsync(id);

        if (user == null)
            return ServiceResponse.Error($"Користувача з Id {id} не знайдено");

        if (!string.IsNullOrEmpty(user.Image))
        {
            try
            {
                // отримуємо тільки файл (без каталогу)
                var imageFileName = Path.GetFileName(user.Image);

                if (!string.IsNullOrEmpty(imageFileName))
                {
                    // видаляємо всі варіанти розмірів у папці "users"
                    await imageService.DeleteImageAsync(imageFileName, Settings.UsersDir);
                }
            }
            catch (Exception ex)
            {
                // Логування помилки видалення картинки — не перериваємо видалення користувача
                // Замініть Console.WriteLine на ILogger у реальному коді
                Console.WriteLine($"Error deleting user image for user {id}: {ex.Message}");
            }
        }

        var result = await userManager.DeleteAsync(user);

        if (result.Succeeded)
            return ServiceResponse.Success($"Користувача {user.UserName} успішно видалено");

        return ServiceResponse.Error($"Не вдалося видалити користувача");
    }

    public async Task<ServiceResponse> GetAllAsync()
    {
        var users = await userManager.Users.ToListAsync();

        var dtos = new List<UserDTO>();

        foreach (var user in users)
        {
            var dto = mapper.Map<UserDTO>(user);

            var roles = await userManager.GetRolesAsync(user);
            dto.Roles = roles.ToArray();

            dtos.Add(dto);
        }

        return ServiceResponse.Success("Користувачів отримано", dtos);
    }

    public async Task<ServiceResponse?> GetByIdAsync(string id)
    {
        var user = await userManager.FindByIdAsync(id);

        if (user != null)
        {
            var dto = mapper.Map<UserDTO>(user);
            var roles = await userManager.GetRolesAsync(user);
            dto.Roles = roles.ToArray();
            return ServiceResponse.Success($"Користувача з Id {id} отримано", dto);
        }

        return ServiceResponse.Error($"Користувача з Id {id} не знайдено");
    }

    public async Task<ServiceResponse> UpdateAsync(UpdateUserDto dto)
    {
        var user = await userManager.FindByIdAsync(dto.Id.ToString());

        if (user == null)
            return ServiceResponse.Error($"Користувача з Id {dto.Id} не знайдено");

        var existingUser = await userManager.FindByEmailAsync(dto.Email);

        if (existingUser != null && existingUser.Id != dto.Id)
            return ServiceResponse.Error($"Користувач з електронною адресою {dto.Email} вже існує");

        // Оновлюємо User за допомогою AutoMapper
        mapper.Map(dto, user);

        // Якщо прийшло нове фото
        if (dto.Image != null)
        {
            // Видаляємо старий аватар, якщо є
            if (!string.IsNullOrEmpty(user.Image))
            {
                await imageService.DeleteImageAsync(user.Image, Settings.UsersDir);
            }

            // Завантажуємо нове фото
            string newImageName = await imageService.SaveImageAsync(dto.Image, Settings.UsersDir);

            // Присвоюємо нове ім’я файла
            user.Image = newImageName;
        }

        // Оновлюємо користувача
        var result = await userManager.UpdateAsync(user);

        if (result.Succeeded)
            return ServiceResponse.Success($"Користувача {user.UserName} успішно оновлено", dto);

        return ServiceResponse.Error($"Не вдалося оновити користувача", dto);
    }

}
