using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WebApi.DAL.Entities.Identity;

public class AppUser : IdentityUser<long>
{
    [MaxLength(255)]
    public string? FirstName { get; set; }
    [MaxLength(255)]
    public string? LastName { get; set; }
    [MaxLength(255)]
    public string? Image { get; set; }

    public DateTime DateCreated { get; set; } = DateTime.SpecifyKind(DateTime.UtcNow, DateTimeKind.Utc);
    public DateTime DateOnline { get; set; } = DateTime.SpecifyKind(DateTime.UtcNow, DateTimeKind.Utc);

    public virtual ICollection<AppUserClaim> Claims { get; set; } = [];
    public virtual ICollection<AppUserLogin> Logins { get; set; } = [];
    public virtual ICollection<AppUserToken> Tokens { get; set; } = [];
    public virtual ICollection<AppUserRole> UserRoles { get; set; } = [];
}
