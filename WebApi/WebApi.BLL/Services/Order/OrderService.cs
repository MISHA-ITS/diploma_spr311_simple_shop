using AutoMapper;
using Microsoft.Extensions.Logging;
using WebApi.BLL.DTOs.Order;
using WebApi.DAL.Entities.Identity;
using WebApi.DAL.Enums;
using WebApi.DAL.Repositories.Advertisements;
using WebApi.DAL.Repositories.Order;

namespace WebApi.BLL.Services.Order;

public class OrderService(
    IOrderRepository orderRepository, 
    IAdvertisementRepository advertisementRepository, 
    ILogger<OrderService> logger, 
    IMapper mapper
) : IOrderService
{
    public async Task<ServiceResponse> CreateAsync(CreateOrderDto dto, long buyerId)
    {
        logger.LogInformation("Creating order for advertisement {AdvertisementId} by user {BuyerId}",
            dto.AdvertisementId,
            buyerId
        );

        var advertisement = await advertisementRepository.GetByIdAsync(dto.AdvertisementId);

        if (advertisement == null)
        {
            logger.LogWarning(
                "Failed to create order: Advertisement {AdvertisementId} not found",
                dto.AdvertisementId
            );
            return ServiceResponse.Error("Оголошення не знайдено");
        }

        if (!advertisement.isActive || advertisement.isBlocked)
        {
            logger.LogWarning(
                "Failed to create order: Advertisement {AdvertisementId} is inactive or blocked",
                dto.AdvertisementId
            );
            return ServiceResponse.Error("Оголошення недоступне");
        }

        if (advertisement.UserId == buyerId)
        {
            logger.LogWarning(
                "User {BuyerId} tried to buy own advertisement {AdvertisementId}",
                buyerId,
                dto.AdvertisementId
            );
            return ServiceResponse.Error("Ви не можете придбати власне оголошення");
        }

        // 🔍 Delivery validation
        if (dto.DeliveryMethod == DeliveryType.NewPost)
        {
            if (string.IsNullOrWhiteSpace(dto.Settlement) ||
                string.IsNullOrWhiteSpace(dto.NewPostWarehouse))
            {
                logger.LogWarning("NewPost delivery validation failed");
                return ServiceResponse.Error("Вкажіть місто та відділення Нової Пошти");
            }
        }

        if (dto.DeliveryMethod == DeliveryType.Courier)
        {
            if (string.IsNullOrWhiteSpace(dto.DeliveryAddress))
            {
                logger.LogWarning("Courier delivery validation failed");
                return ServiceResponse.Error("Вкажіть адресу доставки");
            }
        }

        var order = mapper.Map<OrderEntity>(dto);

        // серверні значення
        order.BuyerId = buyerId;
        order.SellerId = advertisement.UserId;
        order.AdvertisementId = advertisement.Id;
        order.Price = advertisement.Price;
        order.Status = OrderStatus.Pending;

        var created = await orderRepository.CreateAsync(order);

        if (!created)
        {
            logger.LogError(
                "Failed to persist order for advertisement {AdvertisementId}",
                advertisement.Id
            );
            return ServiceResponse.Error("Не вдалося створити замовлення");
        }

        logger.LogInformation(
            "Order {OrderId} successfully created for advertisement {AdvertisementId}",
            order.Id,
            advertisement.Id
        );

        return ServiceResponse.Success("Order created successfully", new { order.Id });
    }
}

