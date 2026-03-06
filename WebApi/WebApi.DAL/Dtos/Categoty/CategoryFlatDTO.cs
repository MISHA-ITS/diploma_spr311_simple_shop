namespace WebApi.DAL.Dtos.Categoty
{
    public class CategoryFlatDto
    {
        public long Id { get; set; }

        public string Name { get; set; } = null!;

        public long? ParentId { get; set; }
    }
}
