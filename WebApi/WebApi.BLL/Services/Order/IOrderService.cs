using WebApi.BLL.DTOs.Order;
using WebApi.DAL.Enums;

namespace WebApi.BLL.Services.Order;

public interface IOrderService
{
    Task<ServiceResponse> CreateAsync(CreateOrderDto dto, long buyerId);
    Task<ServiceResponse> GetByIdAsync(long id, long userId);
    Task<ServiceResponse> GetAllAsync();
    Task<ServiceResponse> UpdateStatusAsync(long orderId, OrderStatus status, long userId);
}
