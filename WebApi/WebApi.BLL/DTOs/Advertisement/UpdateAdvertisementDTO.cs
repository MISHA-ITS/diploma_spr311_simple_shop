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
        public List<IFormFile>? Images { get; set; } = [];
    }
}
