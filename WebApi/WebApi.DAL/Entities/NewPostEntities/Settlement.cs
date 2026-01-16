using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using WebApi.DAL.Entities.Identity;

namespace WebApi.DAL.Entities.NewPostEntities;

[Table("tbl_Settlements")]
public class Settlement : NewPostBaseEntity
{
    [StringLength(100)]
    public string SettlementTypeDescription { get; set; } = string.Empty;

    [Key]
    [StringLength(36)]
    [Unicode(false)]
    public string Ref { get; set; } = null!;

    [StringLength(36)]
    [Unicode(false)]
    public string? Region { get; set; }
    public int Warehouse { get; set; }
    public Region? SettlementRegion { get; set; }
    public ICollection<AppUser> Users { get; set; } = new HashSet<AppUser>();
    public ICollection<AdvertisementEntity> Adverts { get; set; } = new HashSet<AdvertisementEntity>();
}