using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace WebApi.DAL.Entities;

public class CategoryEntity : BaseEntity<long>
{
    [Required]
    [MaxLength(255)]
    public required string Name { get; set; }
    public string Slug { get; set; } = null!;
    public string? ImageUrl { get; set; }
    [ForeignKey(nameof(Parent))]
    public long? ParentId { get; set; }
    public CategoryEntity? Parent { get; set; }
    public ICollection<CategoryEntity> Childs { get; set; } = new HashSet<CategoryEntity>();

    public ICollection<AdvertisementEntity> Advertisements { get; set; } = [];
}
