using Microsoft.AspNetCore.Identity;

namespace WebApi.DAL.Entities.Identity;

public class AppRoleClaim : IdentityRoleClaim<long>
{
    public virtual AppRole? Role { get; set; }
}
