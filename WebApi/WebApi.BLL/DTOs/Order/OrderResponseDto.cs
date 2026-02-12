using WebApi.DAL.Enums;

namespace WebApi.BLL.DTOs.Order;

public class OrderResponseDto
{
    public long Id { get; set; }
    public string AdvertisementName { get; set; }
    public decimal Price { get; set; }
    public OrderStatus Status { get; set; }
    public string BuyerEmail { get; set; }
    public DateTime CreateDate { get; set; }
}
