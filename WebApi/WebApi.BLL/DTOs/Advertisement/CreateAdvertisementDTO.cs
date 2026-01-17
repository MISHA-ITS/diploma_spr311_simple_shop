using Microsoft.AspNetCore.Http;

namespace WebApi.BLL.DTOs.advertisement
{
    public class CreateAdvertisementDTO
    {
        public string Name { get; set; } = string.Empty;
        public string? Description { get; set; }
        public decimal Price { get; set; }
        public List<string> Categories { get; set; } = [];
        public List<IFormFile>? Images { get; set; } = [];
    }
}
