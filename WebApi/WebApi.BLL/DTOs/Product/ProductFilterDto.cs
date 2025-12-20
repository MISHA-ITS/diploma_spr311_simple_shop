namespace WebApi.BLL.DTOs.Product;

public class ProductFilterDto
{
    public long? categoryId { get; set; }
    public decimal? minPrice { get; set; }
    public decimal? maxPrice { get; set; }

    public string? sortBy { get; set; }
    public string? order { get; set; } = "asc";
}
