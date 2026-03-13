namespace WebApi.BLL.DTOs.Order;

public class OrderDetailsDto : BaseOrderDto
{
    public long AdvertisementId { get; set; }

    // BUYER
    public string? BuyerFirstName { get; set; }
    public string? BuyerLastName { get; set; }
    public string? BuyerPhone { get; set; }
    public string? BuyerLocation { get; set; }

    // SELLER
    public string? SellerFirstName { get; set; }
    public string? SellerLastName { get; set; }
    public string? SellerPhone { get; set; }
    public string? SellerLocation { get; set; }
}
