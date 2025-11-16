using Microsoft.AspNetCore.Identity;

namespace WebApi.DAL.Entities.Identity;

public class AppUserClaim : IdentityUserClaim<long>
{
    public virtual AppUser? User { get; set; }
}
