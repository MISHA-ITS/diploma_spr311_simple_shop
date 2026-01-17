using Microsoft.AspNetCore.Http;

namespace WebApi.BLL.DTOs.Category
{
    public class CreateCategoryDTO
    {
        public string Name { get; set; } = string.Empty;
        public int? ParentId { get; init; }
        public IFormFile? Image { get; set; }
    }
}
