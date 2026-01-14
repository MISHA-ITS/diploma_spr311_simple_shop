using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;

namespace WebApi.DAL.Entities.NewPostEntities;

public class NewPostBaseEntity
{
    [Key]
    [StringLength(36)]
    [Unicode(false)]
    public string Ref { get; set; } = null!;

    [StringLength(128)]
    public string Description { get; set; } = null!;
}
