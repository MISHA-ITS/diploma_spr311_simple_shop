using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using WebApi.BLL.Constatnts;
using WebApi.BLL.DTOs;
using WebApi.BLL.DTOs.User;
using WebApi.BLL.Models.Account;
using WebApi.BLL.Services.Image;
using WebApi.DAL;
using WebApi.DAL.Entities.Identity;


namespace WebApi.BLL.Services.User;

public class UserService(AppDbContext dbContext, UserManager<AppUser> userManager, IMapper mapper, IImageService imageService) : IUserService
{
    public async Task<ServiceResponse> CreateAsync(CreateUserDto dto)
    {
        if (await userManager.FindByEmailAsync(dto.Email) != null)
            return ServiceResponse.Error($"Користувач з електронною адресою {dto.Email} вже існує");

        var user = mapper.Map<AppUser>(dto);

        user.UserName = dto.Email;

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

    public async Task<ServiceResponse> DeleteAsync(long id)
    {
        var user = await userManager.FindByIdAsync(id.ToString());

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

    public async Task<ServiceResponse> GetAllAsync(UserFilterDto filter)
    {
        //var users = await dbContext.Users
        //    .ProjectTo<UserDTO>(mapper.ConfigurationProvider)
        //    .ToListAsync();

        var query = dbContext.Users.AsQueryable();

        query = FilterUsers(query, filter);

        var totalCount = await query.CountAsync();

        var users = await query
            .Skip((filter.PageNumber - 1) * filter.PageSize)
            .Take(filter.PageSize)
            .ProjectTo<UserDTO>(mapper.ConfigurationProvider)
            .ToListAsync();

        var response = new PageResponseDTO<UserDTO>
        {
            Items = users,
            Total = totalCount,
            PageNumber = filter.PageNumber,
            PageSize = filter.PageSize
        };

        return ServiceResponse.Success("Користувачів отримано", response);
    }

    public async Task<ServiceResponse?> GetByIdAsync(long id)
    {
        var user = await dbContext.Users
            .Where(u => u.Id == id)
            .ProjectTo<UserProfileModel>(mapper.ConfigurationProvider)
            .FirstOrDefaultAsync();

        if (user == null)
            return ServiceResponse.Error($"Користувача з Id {id} не знайдено");

        return ServiceResponse.Success($"Користувача з Id {id} отримано", user);
    }

    public async Task<ServiceResponse> UpdateAsync(UpdateUserDto dto)
    {
        // 1. Знаходимо користувача
        var user = await userManager.FindByIdAsync(dto.Id.ToString());

        if (user == null)
            return ServiceResponse.Error($"Користувача з Id {dto.Id} не знайдено");

        // 2. Перевірка email на унікальність
        var existingUser = await userManager.FindByEmailAsync(dto.Email);

        if (existingUser != null && existingUser.Id != dto.Id)
            return ServiceResponse.Error($"Користувач з електронною адресою {dto.Email} вже існує");

        // 3. ЗБЕРІГАЄМО СТАРЕ ЗОБРАЖЕННЯ
        string? oldImage = user.Image;

        // 4. ОНОВЛЮЄМО ВСІ ПОЛЯ, КРІМ Image
        // ❗ AutoMapper повинен мати .ForMember(x => x.Image, opt => opt.Ignore())
        mapper.Map(dto, user);

        // 5. Якщо передали нове фото — зберігаємо його
        if (dto.Image != null)
        {
            // 5.1 Зберігаємо нове фото
            string newImageName = await imageService.SaveImageAsync(dto.Image, Settings.UsersDir);

            // 5.2 Присвоюємо нове ім’я
            user.Image = newImageName;

            // 5.3 (опціонально) Видаляємо старі файли
            if (!string.IsNullOrEmpty(oldImage))
            {
                await imageService.DeleteImageAsync(oldImage, Settings.UsersDir);
            }
        }
        else
        {
            // 6. Якщо нове фото НЕ передавали — залишаємо старе
            user.Image = oldImage;
        }

        // 7. ОНОВЛЮЄМО КОРИСТУВАЧА В БАЗІ
        var result = await userManager.UpdateAsync(user);

        if (!result.Succeeded)
        {
            var errors = string.Join("; ", result.Errors.Select(e => e.Description));
            return ServiceResponse.Error($"Не вдалося оновити користувача: {errors}");
        }

        var currentRoles = await userManager.GetRolesAsync(user);

        await userManager.RemoveFromRolesAsync(user, currentRoles);

        if (dto.Roles.Any())
        {
            await userManager.AddToRolesAsync(user, dto.Roles);
        }

        return ServiceResponse.Success("Користувача успішно оновлено");
    }

    public async Task<ServiceResponse> LockUserAsync(long userId, TimeSpan? duration = null)
    {
        var user = await userManager.FindByIdAsync(userId.ToString());

        if (user == null)
            return ServiceResponse.Error("Користувача не знайдено");

        // дозволити блокування якщо раптом вимкнено
        if (!user.LockoutEnabled)
            await userManager.SetLockoutEnabledAsync(user, true);

        // якщо не передали — блокуємо на 30 днів
        var lockTime = duration ?? TimeSpan.FromDays(30);

        await userManager.SetLockoutEndDateAsync(
            user,
            DateTimeOffset.UtcNow.Add(lockTime)
        );

        return ServiceResponse.Success("Користувача заблоковано");
    }

    public async Task<ServiceResponse> UnlockUserAsync(long userId)
    {
        var user = await userManager.FindByIdAsync(userId.ToString());

        if (user == null)
            return ServiceResponse.Error("Користувача не знайдено");

        await userManager.SetLockoutEndDateAsync(user, null);
        await userManager.ResetAccessFailedCountAsync(user);

        return ServiceResponse.Success("Користувача розблоковано");
    }

    //public async Task<bool> IsUserLockedAsync(long userId)
    //{
    //    var user = await userManager.FindByIdAsync(userId.ToString());
    //    if (user == null) return false;

    //    return await userManager.IsLockedOutAsync(user);
    //}

    private IQueryable<AppUser> FilterUsers(
        IQueryable<AppUser> users,
        UserFilterDto filter)
    {
        if (!string.IsNullOrWhiteSpace(filter.Search))
        {
            var search = filter.Search.Trim().ToLower();

            users = users.Where(u =>
                u.Email!.ToLower().Contains(search) ||
                u.FirstName!.ToLower().Contains(search) ||
                u.LastName!.ToLower().Contains(search) ||
                (u.FirstName + " " + u.LastName).ToLower().Contains(search)
            );
        }

        if (filter.IsLocked.HasValue)
        {
            var now = DateTimeOffset.UtcNow;

            users = filter.IsLocked.Value
                ? users.Where(u => u.LockoutEnd > now)
                : users.Where(u => u.LockoutEnd == null || u.LockoutEnd <= now);
        }

        if (filter.Roles is { Count: > 0 })
        {
            users = users.Where(u =>
                u.UserRoles.Any(ur => filter.Roles.Contains(ur.Role!.Name!))
            );
        }

        return users.OrderBy(u => u.Id);
    }
}
