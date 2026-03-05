using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using WebApi.DAL.Dtos.Categoty;
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
    public async Task<List<long>> GetAllChildCategoryIdsAsync(long parentId)
    {
        _logger.LogDebug("Fetching all child categories for parentId {ParentId}", parentId);

        var allCategories = await _context.Categories
            .AsNoTracking()
            .ToListAsync();

        var lookup = allCategories
            .Where(c => c.ParentId.HasValue)
            .GroupBy(c => c.ParentId.Value)
            .ToDictionary(g => g.Key, g => g.ToList());

        List<long> GetIds(long id)
        {
            var ids = new List<long> { id }; 

            if (lookup.TryGetValue(id, out var children))
            {
                foreach (var child in children)
                {
                    ids.AddRange(GetIds(child.Id));
                }
            }

            return ids;
        }

        return GetIds(parentId);
    }

    public async Task<List<CategoryFlatDto>> GetAllFlatAsync()
    {
        return await _context.Categories
            .AsNoTracking()
            .Select(c => new CategoryFlatDto
            {
                Id = c.Id,
                Name = c.Name,
                ParentId = c.ParentId
            })
            .ToListAsync();
    }
}

