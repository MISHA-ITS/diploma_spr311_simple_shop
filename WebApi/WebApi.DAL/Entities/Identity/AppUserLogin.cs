using Microsoft.AspNetCore.Identity;

namespace WebApi.DAL.Entities.Identity;

public class AppUserLogin : IdentityUserLogin<long>
{
    public virtual AppUser? User { get; set; }
}
