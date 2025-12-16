using System.ComponentModel.DataAnnotations;

namespace WebApi.DAL.Entities;

public class CategoryEntity : BaseEntity<long>
{
    [Required]
    [MaxLength(255)]
    public required string Name { get; set; }
    public string Slug { get; set; } = null!;
    public string? ImageUrl { get; set; }

    public ICollection<ProductEntity> Products { get; set; } = [];
}
