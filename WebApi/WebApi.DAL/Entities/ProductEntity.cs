using System.ComponentModel.DataAnnotations;

namespace WebApi.DAL.Entities
{
    public class ProductEntity : BaseEntity<long>
    {
        [Required]
        [MaxLength(255)]
        public required string Name { get; set; }
        public string Slug { get; set; } = string.Empty;
        public string? Description { get; set; }
        [Range(0, double.MaxValue)]
        public decimal Price { get; set; }
        public ICollection<CategoryEntity> Categories { get; set; } = [];
        public ICollection<ProductImageEntity> Images { get; set; } = [];
    }
}
