using WebApi.DAL.Entities;

namespace WebApi.DAL.Repositories.Products
{
    public interface IProductRepository : IGenericRepository<ProductEntity, long>
    {
        Task<bool> CreateRangeAsync(IEnumerable<ProductEntity> products);
    }
}
