namespace WebApi.BLL.DTOs.Order;

public class OrderResponseDto : BaseOrderDto
{
    public long AdvertisementId { get; set; }
    public string? BuyerFullName { get; set; }
    public string? SellerFullName { get; set; }
}
