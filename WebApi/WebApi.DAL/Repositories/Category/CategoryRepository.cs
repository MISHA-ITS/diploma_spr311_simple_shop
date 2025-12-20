using Microsoft.Extensions.Logging;
using WebApi.DAL.Entities;

namespace WebApi.DAL.Repositories.Category;

public class CategoryRepository(AppDbContext context, ILogger<GenericRepository<CategoryEntity, long>> logger) :
    GenericRepository<CategoryEntity, long>(context, logger), ICategoryRepository
{
    public async Task<bool> CreateRangeAsync(IEnumerable<CategoryEntity> categories)
    {
        if (categories == null || !categories.Any())
        {
            _logger.LogWarning("CreateRangeAsync called with empty categories collection");
            return false;
        }

        var now = DateTime.UtcNow;

        foreach (var category in categories)
        {
            category.CreateDate = now;
            category.UpdateDate = now;
        }

        try
        {
            await _context.Categories.AddRangeAsync(categories);
            var result = await _context.SaveChangesAsync();

            if (result > 0)
            {
                _logger.LogInformation("Successfully created {Count} categories", categories.Count());
                return true;
            }
            else
            {
                _logger.LogWarning("Failed to create categories. No records saved.");
                return false;
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Exception occurred while creating {Count} categories", categories.Count());
            return false;
        }
    }
}
