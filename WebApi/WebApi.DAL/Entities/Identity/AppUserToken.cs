using Microsoft.AspNetCore.Identity;

namespace WebApi.DAL.Entities.Identity;

public class AppUserToken : IdentityUserToken<long>
{
    public virtual AppUser? User { get; set; }
}
