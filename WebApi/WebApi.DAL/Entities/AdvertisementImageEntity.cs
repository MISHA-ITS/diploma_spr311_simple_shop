using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace WebApi.DAL.Entities
{
    public class AdvertisementImageEntity : BaseEntity<long>
    {
        [Key]
        public override long Id { get; set; }
        public string? ImageUrl { get; set; }
        public bool IsMain { get; set; }

        public long AdvertisementId { get; set; }
        public AdvertisementEntity? Advertisement { get; set; }
    }
}
