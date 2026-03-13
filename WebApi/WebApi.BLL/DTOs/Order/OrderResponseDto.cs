namespace WebApi.BLL.DTOs.Order;

public class OrderResponseDto : BaseOrderDto
{
    public long AdvertisementId { get; set; }

    // Покупець
    public long BuyerId { get; set; }
    public string? BuyerFullName { get; set; }


    // Продавець
    public long SellerId { get; set; }
    public string? SellerFullName { get; set; }
}
