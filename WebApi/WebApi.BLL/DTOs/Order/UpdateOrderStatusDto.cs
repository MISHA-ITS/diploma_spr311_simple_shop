using WebApi.DAL.Enums;

namespace WebApi.BLL.DTOs.Order;

public class UpdateOrderStatusDto
{
    public OrderStatus Status { get; set; }
}
