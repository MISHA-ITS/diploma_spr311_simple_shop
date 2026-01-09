namespace WebApi.BLL.DTOs.Category;

public class CategoryDTO
{
    public long Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? ImageUrl { get; set; }
    public long? ParentId { get; set; }
    public string? ParentName { get; set; }
    public IEnumerable<CategoryDTO> Childs { get; set; } = new HashSet<CategoryDTO>();
}
