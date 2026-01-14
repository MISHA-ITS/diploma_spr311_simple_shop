using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using WebApi.DAL.Entities.Identity;
using WebApi.DAL.Entities.NewPostEntities;

namespace WebApi.DAL.Entities
{
    public class AdvertisementEntity : BaseEntity<long>
    {
        [Required]
        [MaxLength(255)]
        public required string Name { get; set; }
        public string? Description { get; set; }
        [Range(0, double.MaxValue)]
        public decimal Price { get; set; }
        public bool isApproved { get; set; } = false;
        public bool isBlocked { get; set; } = false;
        public bool isActive { get; set; } = false;
        public bool IsContractPrice { get; set; } = false;

        public long UserId { get; set; }
        public AppUser? User { get; set; }


        [StringLength(36)]
        [Unicode(false)]
        public string? SettlementRef { get; set; }
        public Settlement? Settlement { get; set; }
        public ICollection<CategoryEntity> Categories { get; set; } = [];
        public ICollection<AdvertisementImageEntity> Images { get; set; } = [];
    }
}
