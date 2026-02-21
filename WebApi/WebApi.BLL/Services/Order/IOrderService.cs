using WebApi.BLL.DTOs.Order;

namespace WebApi.BLL.Services.Order;

public interface IOrderService
{
    Task<ServiceResponse> CreateAsync(CreateOrderDto dto, long buyerId);
    Task<ServiceResponse> GetByIdAsync(long id, long userId);
    Task<ServiceResponse> GetAllAsync();
    Task<ServiceResponse> GetAllAsync(OrderFilterDto filter);
    Task<ServiceResponse> UpdateStatusAsync(long orderId, UpdateOrderStatusDto dto, long userId);
    Task<ServiceResponse> GetMyOrdersAsync(long userId);
    Task<ServiceResponse> GetSellerOrdersAsync(long sellerId);
    Task<ServiceResponse> CancelAsync(long orderId, long userId);
}
