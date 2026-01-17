namespace WebApi.BLL.DTOs.advertisement;

public class advertisementFilterDto
{
    public long? categoryId { get; set; }
    public decimal? minPrice { get; set; }
    public decimal? maxPrice { get; set; }

    public string? sortBy { get; set; }
    public string? order { get; set; } = "asc";

    public int pageNumber { get; set; } = 1;
}
