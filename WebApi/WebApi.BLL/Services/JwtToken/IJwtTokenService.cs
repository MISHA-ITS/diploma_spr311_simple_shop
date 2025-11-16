using WebApi.DAL.Entities.Identity;

namespace WebApi.BLL.Services.JwtToken;

public interface IJwtTokenService
{
    Task<string> GenerateTokenAsync(AppUser user);
}
