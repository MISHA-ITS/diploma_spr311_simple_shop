using Microsoft.EntityFrameworkCore;
using WebApi.DAL.Entities;

namespace WebApi.DAL.Repositories.Products;

public class ProductRepository(AppDbContext context) :
    GenericRepository<ProductEntity, long>(context), IProductRepository
{
    public async Task<bool> CreateRangeAsync(IEnumerable<ProductEntity> products)
    {
        var now = DateTime.UtcNow;

        foreach (var product in products)
        {
            product.CreateDate = now;
            product.UpdateDate = now;
        }

        await _context.Products.AddRangeAsync(products);
        var result = await _context.SaveChangesAsync();
        return result != 0;
    }

    public override IQueryable<ProductEntity> GetAll()
    {
        return _context.Set<ProductEntity>()
            .Include(p => p.Images)
            .Include(p => p.Categories);
    }

    public override async Task<ProductEntity?> GetByIdAsync(long id)
    {
        return await _context.Products
            .Include(p => p.Images)
            .Include(p => p.Categories)
            .FirstOrDefaultAsync(x => x.Id == id);
    }
}