using AutoMapper;
using Microsoft.EntityFrameworkCore;
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

        logger.LogInformation(
            "Advertisement state: Active={Active}, Approved={Approved}, Blocked={Blocked}",
            advertisement.isActive,
            advertisement.isApproved,
            advertisement.isBlocked
        );

        if (!advertisement.isActive)
            return ServiceResponse.Error("Оголошення неактивне");

        if (!advertisement.isApproved)
            return ServiceResponse.Error("Оголошення не підтверджене");

        if (advertisement.isBlocked)
            return ServiceResponse.Error("Оголошення заблоковане");

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

        if (advertisement.UserId == buyerId)
        {
            return ServiceResponse.Error("Ви не можете замовити власне оголошення");
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

        return ServiceResponse.Success("Замовлення успішно створено", new { order.Id });
    }

    public async Task<ServiceResponse> GetAllAsync()
    {
        var orders = await orderRepository.GetAll().ToListAsync();

        var result = mapper.Map<List<OrderResponseDto>>(orders);

        return ServiceResponse.Success("Повний перелік замовлень успішно отримано", result);
    }

    public async Task<ServiceResponse> GetByIdAsync(long id, long userId)
    {
        var order = await orderRepository.GetByIdAsync(id);

        if (order == null)
            return ServiceResponse.Error("Замовлення не знайдено");

        if (order.BuyerId != userId && order.SellerId != userId)
            return ServiceResponse.Error("Немає доступу");

        var dto = mapper.Map<OrderResponseDto>(order);

        return ServiceResponse.Success("Замовлення з Id {OrderId} успішно отримано", dto);
    }

    public async Task<ServiceResponse> UpdateStatusAsync(long orderId, OrderStatus status, long userId)
    {
        var order = await orderRepository.GetByIdAsync(orderId);

        if (order == null)
            return ServiceResponse.Error("Замовлення не знайдено");

        if (order.SellerId != userId)
            return ServiceResponse.Error("Лише продавець може змінити статус");

        order.Status = status;
        order.UpdatedAt = DateTime.UtcNow;

        var updated = await orderRepository.UpdateAsync(order);

        if (!updated)
            return ServiceResponse.Error("Не вдалося оновити замовлення");

        return ServiceResponse.Success("Статус оновлено");
    }
}

