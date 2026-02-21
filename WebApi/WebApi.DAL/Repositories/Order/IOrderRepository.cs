using WebApi.DAL.Entities;

namespace WebApi.DAL.Repositories.Order;

public interface IOrderRepository : IGenericRepository<OrderEntity, long>
{
    Task<List<OrderEntity>> GetAllWithDetailsAsync();
    Task<OrderEntity?> GetByIdWithDetailsAsync(long id);
}