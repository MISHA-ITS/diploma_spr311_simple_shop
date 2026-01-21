namespace WebApi.BLL.DTOs
{
    public class PageResponseDTO<T>
    {
        public int Total { get; set; }
        public List<T> Items { get; set; } = new();
    }
}
