using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace WebApi.DAL.Entities.NewPostEntities;

[Table("tbl_Regions")]
public class Region : NewPostBaseEntity
{
    [StringLength(50)]
    public required string RegionType { get; set; }

    [StringLength(36)]
    [Unicode(false)]
    public required string AreaRef { get; set; }

    public string? AreasCenter { get; set; }

    [JsonIgnore]
    public required Area Area { get; set; }

    public ICollection<Settlement> Settlements = new HashSet<Settlement>();
}
