namespace WebApi.BLL.DTOs.Category
{
    public class CategoryWithCountDto
    {
        public long Id { get; set; }
        public required string Name { get; set; }
        public int AdvCount { get; set; }
        public List<CategoryWithCountDto> Childs { get; set; } = [];
    }
}
