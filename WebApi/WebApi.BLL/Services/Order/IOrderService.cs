using WebApi.BLL.DTOs.Order;

namespace WebApi.BLL.Services.Order;

public interface IOrderService
{
    Task<ServiceResponse> CreateAsync(CreateOrderDto dto, long buyerId);
}
