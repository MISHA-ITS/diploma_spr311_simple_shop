using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WebApi.DAL.Entities.Identity;

public class AppUserLogin : IdentityUserLogin<long>
{
    public virtual AppUser? User { get; set; }
}
