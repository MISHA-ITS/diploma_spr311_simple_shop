using WebApi.DAL.Dtos.Categoty;
using WebApi.DAL.Entities;

namespace WebApi.DAL.Repositories.Category
{
    public interface ICategoryRepository : IGenericRepository<CategoryEntity, long>
    {
        Task<bool> CreateRangeAsync(IEnumerable<CategoryEntity> categories);
        Task<List<long>> GetAllChildCategoryIdsAsync(long parentId);
        Task<List<CategoryFlatDto>> GetAllFlatAsync();
    }
}
