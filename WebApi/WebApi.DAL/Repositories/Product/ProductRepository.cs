using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using WebApi.DAL.Entities;

namespace WebApi.DAL.Repositories.Products;

public class ProductRepository(AppDbContext context, ILogger<GenericRepository<ProductEntity, long>> logger) :
    GenericRepository<ProductEntity, long>(context, logger), IProductRepository
{
    public async Task<bool> CreateRangeAsync(IEnumerable<ProductEntity> products)
    {
        if (products == null || !products.Any())
        {
            _logger.LogWarning("CreateRangeAsync called with empty products collection");
            return false;
        }

        var now = DateTime.UtcNow;

        foreach (var product in products)
        {
            product.CreateDate = now;
            product.UpdateDate = now;
        }

        try
        {
            await _context.Products.AddRangeAsync(products);
            var result = await _context.SaveChangesAsync();

            if (result > 0)
            {
                _logger.LogInformation("Successfully created {Count} products", products.Count());
                return true;
            }
            else
            {
                _logger.LogWarning("Failed to create products. No records saved.");
                return false;
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Exception occurred while creating {Count} products", products.Count());
            return false;
        }
    }

    public override IQueryable<ProductEntity> GetAll(QueryTrackingBehavior tracking = QueryTrackingBehavior.NoTracking)
    {
        _logger.LogDebug("Fetching all products with related Images and Categories");
        return _context.Set<ProductEntity>()
            .AsTracking(tracking)
            .Include(p => p.Images)
            .Include(p => p.Categories)
            .AsSplitQuery();
    }

    public override async Task<ProductEntity?> GetByIdAsync(long id)
    {
        try
        {
            var product = await _context.Products
                .Include(p => p.Images)
                .Include(p => p.Categories)
                .AsSplitQuery()
                .FirstOrDefaultAsync(x => x.Id == id);

            if (product != null)
                _logger.LogDebug("Fetched product with Id {ProductId}", id);
            else
                _logger.LogWarning("Product with Id {ProductId} not found", id);

            return product;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Exception occurred while fetching product with Id {ProductId}", id);
            return null;
        }
    }
}