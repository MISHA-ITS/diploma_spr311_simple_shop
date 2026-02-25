namespace WebApi.BLL.DTOs.Advertisement
{
    public class AdvertisementDTO
    {
        public long Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string? Description { get; set; }
        public decimal Price { get; set; }
        public string? SettlementRef { get; set; }
        public long CategoryId { get; set; }
        public long UserId { get; set; }
        public List<string> Images { get; set; } = [];
    }
}
