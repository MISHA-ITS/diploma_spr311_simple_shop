using WebApi.DAL.Enums;

namespace WebApi.BLL.DTOs.Order;

public class CreateOrderDto
{
    public long AdvertisementId { get; set; }

    // контакти покупця
    public required string FirstName { get; set; }
    public required string LastName { get; set; }
    public required string Email { get; set; }
    public required string PhoneNumber { get; set; }

    // доставка
    public DeliveryType DeliveryMethod { get; set; }
    public string? Settlement { get; set; }
    public string? NewPostWarehouse { get; set; }
    public string? DeliveryAddress { get; set; }

    // оплата
    public PaymentMethod PaymentMethod { get; set; }
}
