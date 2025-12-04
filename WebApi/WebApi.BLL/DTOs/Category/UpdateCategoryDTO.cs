using Microsoft.AspNetCore.Http;

namespace WebApi.BLL.DTOs.Category;

public class UpdateCategoryDTO
{
    public long Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;
    public IFormFile? Image { get; set; }
}
