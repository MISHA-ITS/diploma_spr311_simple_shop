using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using WebApi.DAL.Entities;

namespace WebApi.DAL.Repositories.Order;

public class OrderRepository(
    AppDbContext context,
    ILogger<GenericRepository<OrderEntity, long>> logger)
    : GenericRepository<OrderEntity, long>(context, logger),
      IOrderRepository
{
    public async Task<List<OrderEntity>> GetAllWithDetailsAsync()
    {
        return await _context.Orders
            .Include(o => o.Advertisement)
                .ThenInclude(a => a.Images)
            .Include(o => o.Buyer)
            .Include(o => o.Seller)
            .OrderByDescending(o => o.CreateDate)
            .ToListAsync();
    }

    public async Task<OrderEntity?> GetByIdWithDetailsAsync(long id)
    {
        return await _context.Orders
            .Include(o => o.Advertisement)
                .ThenInclude(a => a.Images)

            .Include(o => o.Advertisement)
                .ThenInclude(a => a.Settlement)

            .Include(o => o.Buyer)
            .Include(o => o.Seller)

            .FirstOrDefaultAsync(o => o.Id == id);
    }
}
