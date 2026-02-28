using WebApi.BLL.DTOs.NewPost;

namespace WebApi.BLL.DTOs.Advertisement
{
    public class AdvertisementDTO
    {
        public long Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string? Description { get; set; }
        public decimal Price { get; set; }
        public bool IsApproved { get; set; }
        public bool IsBlocked { get; set; }
        public bool IsActive { get; set; }
        public long CategoryId { get; set; }
        public long UserId { get; set; }
        public List<string> Images { get; set; } = [];
        public SettlementDto? Settlement { get; set; }
    }
}
