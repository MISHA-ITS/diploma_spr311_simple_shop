using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using WebApi.DAL.Entities.NewPostEntities;

namespace WebApi.DAL.Entities.Identity;

public class AppUser : IdentityUser<long>
{
    [MaxLength(255)]
    public string? FirstName { get; set; }
    [MaxLength(255)]
    public string? LastName { get; set; }
    [MaxLength(255)]
    public string? Image { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.SpecifyKind(DateTime.UtcNow, DateTimeKind.Utc);
    public DateTime DateOnline { get; set; } = DateTime.SpecifyKind(DateTime.UtcNow, DateTimeKind.Utc);

    [NotMapped]
    [StringLength(36)]
    [Unicode(false)]
    public string? SettlementRef { get; set; }
    [NotMapped]
    public Settlement? Settlement { get; set; }
    public virtual ICollection<AppUserClaim> Claims { get; set; } = [];
    public virtual ICollection<AppUserLogin> Logins { get; set; } = [];
    public virtual ICollection<AppUserToken> Tokens { get; set; } = [];
    public virtual ICollection<AppUserRole> UserRoles { get; set; } = [];
}
