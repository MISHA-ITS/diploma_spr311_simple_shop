using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WebApi.DAL.Entities.Identity;

public class AppRole : IdentityRole<long>
{
    public virtual ICollection<AppUserRole> UserRoles { get; set; } = [];
    public virtual ICollection<AppRoleClaim> RoleClaims { get; set; } = [];
}
