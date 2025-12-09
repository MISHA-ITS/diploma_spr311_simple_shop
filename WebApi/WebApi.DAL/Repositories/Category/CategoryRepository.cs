using WebApi.DAL.Entities;

namespace WebApi.DAL.Repositories.Category;

public class CategoryRepository(AppDbContext context) :
    GenericRepository<CategoryEntity, long>(context), ICategoryRepository
{
    public async Task<bool> CreateRangeAsync(IEnumerable<CategoryEntity> categories)
    {
        var now = DateTime.UtcNow;

        foreach (var category in categories)
        {
            category.CreateDate = now;
            category.UpdateDate = now;
        }

        await _context.Categories.AddRangeAsync(categories);
        var result = await _context.SaveChangesAsync();
        return result != 0;
    }
}
