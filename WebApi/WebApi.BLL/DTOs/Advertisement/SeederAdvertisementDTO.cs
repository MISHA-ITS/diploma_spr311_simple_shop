namespace WebApi.BLL.DTOs.Advertisement
{
    public class SeederAdvertisementDTO
    {
        public string Name { get; set; } = string.Empty;
        public string? Description { get; set; }
        public decimal Price { get; set; }
        public int UserId { get; set; }
        public List<string> Categories { get; set; } = [];
        public List<string>? Images { get; set; } = [];
    }
}
