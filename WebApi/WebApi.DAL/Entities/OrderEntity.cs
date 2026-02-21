using WebApi.DAL.Entities.Identity;
using WebApi.DAL.Enums;

namespace WebApi.DAL.Entities;

public class OrderEntity : BaseEntity<long>
{
    // === ПОКУПЕЦЬ ===
    public long BuyerId { get; set; }
    public virtual AppUser Buyer { get; set; } = null!;

    // === ПРОДАВЕЦЬ ===
    public long SellerId { get; set; }
    public virtual AppUser Seller { get; set; } = null!;

    // === ОГОЛОШЕННЯ ===
    public long AdvertisementId { get; set; }
    public virtual AdvertisementEntity Advertisement { get; set; } = null!;

    // фіксуємо ціну на момент замовлення
    public decimal Price { get; set; }

    // === КОНТАКТИ ПОКУПЦЯ ===
    public required string BuyerFirstName { get; set; }
    public required string BuyerLastName { get; set; }
    public required string BuyerPhone { get; set; }
    public required string BuyerEmail { get; set; }

    // === ДОСТАВКА ===
    public DeliveryType DeliveryMethod { get; set; }

    // обовʼязкові тільки для NewPost
    public string? City { get; set; }
    public string? NewPostWarehouse { get; set; }

    // для Courier
    public string? DeliveryAddress { get; set; }

    // === ОПЛАТА ===
    public PaymentMethod PaymentMethod { get; set; }

    // === СТАТУС ===
    public OrderStatus Status { get; set; } = OrderStatus.Pending;

    // === ІНШЕ ===
    public string? TrackingNumber { get; set; }
    public DateTime? UpdatedAt { get; set; }
}
