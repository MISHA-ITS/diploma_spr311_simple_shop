using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace WebApi.DAL.Entities.NewPostEntities;

[Table("tbl_Areas")]
public class Area : NewPostBaseEntity
{
    [StringLength(50)]
    public required string RegionType { get; set; }
    public ICollection<Region> Regions { get; set; } = new HashSet<Region>();
}
