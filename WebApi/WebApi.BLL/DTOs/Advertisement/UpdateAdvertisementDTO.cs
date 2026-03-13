using Microsoft.AspNetCore.Http;

namespace WebApi.BLL.DTOs.Advertisement
{
    public class UpdateAdvertisementDTO
    {
        public long Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string? Description { get; set; }
        public decimal Price { get; set; }
        public long CategoryId { get; set; }
        public bool IsContractPrice { get; set; }
        public string SettlementRef { get; init; } = string.Empty;
        public string PhoneNumber { get; set; }
        public int MainImageIndex { get; set; }
        public List<string>? ExistingImages { get; set; } = new();
        public List<IFormFile>? Images { get; set; } = new();
    }
}
