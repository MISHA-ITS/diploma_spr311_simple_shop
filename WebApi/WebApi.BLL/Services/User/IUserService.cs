using WebApi.BLL.DTOs.User;

namespace WebApi.BLL.Services.User;

public interface IUserService
{
    Task<ServiceResponse> CreateAsync(CreateUserDto dto);
    Task<ServiceResponse> UpdateAsync(UpdateUserDto dto);
    Task<ServiceResponse> DeleteAsync(long id);
    Task<ServiceResponse?> GetByIdAsync(long id);
    Task<ServiceResponse> GetAllAsync(UserFilterDto filter);
    Task<ServiceResponse> LockUserAsync(long userId, TimeSpan? duration = null);
    Task<ServiceResponse> UnlockUserAsync(long userId);
    Task<ServiceResponse> AddFavoriteAdvert(long userId,long advertId);
    Task<ServiceResponse> RemoveFavoriteAdvert(long userId, long advertId);
    Task<ServiceResponse> RemoveAllFavorites(long userId);
}
