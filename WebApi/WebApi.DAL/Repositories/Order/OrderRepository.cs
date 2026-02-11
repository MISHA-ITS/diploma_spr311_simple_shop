using Microsoft.Extensions.Logging;
using WebApi.DAL.Entities.Identity;

namespace WebApi.DAL.Repositories.Order;

public class OrderRepository(
    AppDbContext context,
    ILogger<GenericRepository<OrderEntity, long>> logger)
    : GenericRepository<OrderEntity, long>(context, logger),
      IOrderRepository
{

}
