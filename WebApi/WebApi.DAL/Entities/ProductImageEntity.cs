using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace WebApi.DAL.Entities
{
    public class ProductImageEntity : BaseEntity<long>
    {
        [Key]
        public override long Id { get; set; }
        public required string Name { get; set; }

        public long ProductId { get; set; }
        public ProductEntity? Product { get; set; }
    }
}
