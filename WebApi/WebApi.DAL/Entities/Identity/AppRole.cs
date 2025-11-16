using Microsoft.AspNetCore.Identity;

namespace WebApi.DAL.Entities.Identity;

public class AppRole : IdentityRole<long>
{
    public virtual ICollection<AppUserRole> UserRoles { get; set; } = [];
    public virtual ICollection<AppRoleClaim> RoleClaims { get; set; } = [];
}
