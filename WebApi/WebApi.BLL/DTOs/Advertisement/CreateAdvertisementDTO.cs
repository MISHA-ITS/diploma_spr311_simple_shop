using Microsoft.AspNetCore.Http;

namespace WebApi.BLL.DTOs.Advertisement
{
    public class CreateAdvertisementDTO
    {
        public string Name { get; set; } = string.Empty;
        public string? Description { get; set; }
        public decimal Price { get; set; }
        public bool IsContractPrice { get; set; }
        public string SettlementRef { get; init; } = string.Empty;
        public long CategoryId { get; set; }
        public string PhoneNumber { get; set; }
        public List<IFormFile> Images { get; set; } = [];
        public int MainImageIndex { get; set; }
    }
}
