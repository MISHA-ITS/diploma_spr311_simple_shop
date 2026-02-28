using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using WebApi.BLL.DTOs.Order;
using WebApi.BLL.Services.NewPost;
using WebApi.DAL.Entities;
using WebApi.DAL.Enums;
using WebApi.DAL.Repositories.Advertisements;
using WebApi.DAL.Repositories.Order;

namespace WebApi.BLL.Services.Order;

public class OrderService(
    IOrderRepository orderRepository, 
    IAdvertisementRepository advertisementRepository,
    INewPostService newPostService,
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

        if (string.IsNullOrWhiteSpace(dto.Settlement))
        {
            logger.LogWarning("Delivery validation failed");
            return ServiceResponse.Error("Вкажіть населений пункт доставки");
        }

        var settlement = await newPostService.GetSettlement(dto.Settlement);

        if (settlement == null)
            return ServiceResponse.Error("Невірний населений пункт");

        order.City = settlement.Description;

        // 🔍 Delivery validation
        if (dto.DeliveryMethod == DeliveryType.NewPost)
        {
            if (string.IsNullOrWhiteSpace(dto.NewPostWarehouse))
            {
                logger.LogWarning("NewPost delivery validation failed");
                return ServiceResponse.Error("Вкажіть відділення Нової Пошти");
            }

            var warehouses = await newPostService.GetWarehousesBySettlementAsync(dto.Settlement);

            var warehouse = warehouses.FirstOrDefault(w => w.Ref == dto.NewPostWarehouse);

            if (warehouse == null)
                return ServiceResponse.Error("Невірне відділення");

            // зберігаємо стабільні дані
            order.NewPostWarehouse = warehouse.Description;
        }

        if (dto.DeliveryMethod == DeliveryType.Courier)
        {
            if (string.IsNullOrWhiteSpace(dto.DeliveryAddress))
            {
                logger.LogWarning("Courier delivery validation failed");
                return ServiceResponse.Error("Вкажіть адресу доставки");
            }
        }

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
        var orders = await orderRepository.GetAllWithDetailsAsync();

        var result = mapper.Map<List<OrderResponseDto>>(orders);

        return ServiceResponse.Success("Повний перелік замовлень успішно отримано", result);
    }

    public async Task<ServiceResponse> GetAllAsync(OrderFilterDto filter)
    {
        IQueryable<OrderEntity> query = orderRepository
            .GetAll()
            .AsNoTracking();

        if (filter.Status.HasValue)
            query = query.Where(o => o.Status == filter.Status.Value);

        if (filter.DateFrom.HasValue)
            query = query.Where(o => o.CreateDate >= filter.DateFrom.Value);

        if (filter.DateTo.HasValue)
            query = query.Where(o => o.CreateDate <= filter.DateTo.Value);

        var totalCount = await query.CountAsync();

        var orders = await query
            .OrderByDescending(o => o.CreateDate)
            .ProjectTo<OrderResponseDto>(mapper.ConfigurationProvider)
            .Skip((filter.PageNumber - 1) * filter.PageSize)
            .Take(filter.PageSize)
            .ToListAsync();

        //var result = mapper.Map<List<OrderResponseDto>>(orders);

        return ServiceResponse.Success("Повний перелік замовлень успішно отримано", new
        {
            totalCount,
            filter.PageNumber,
            filter.PageSize,
            items = orders
        });
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

    public async Task<ServiceResponse> UpdateStatusAsync(long orderId, UpdateOrderStatusDto dto, long userId)
    {
        var order = await orderRepository.GetByIdAsync(orderId);

        if (order == null)
            return ServiceResponse.Error("Замовлення не знайдено");

        if (order.SellerId != userId)
            return ServiceResponse.Error("Лише продавець може змінити статус");

        if (!IsValidStatusTransition(order.Status, dto.Status))
            return ServiceResponse.Error(
                $"Неможливо змінити статус з {order.Status} на {dto.Status}");

        order.Status = dto.Status;
        order.UpdatedAt = DateTime.UtcNow;

        var updated = await orderRepository.UpdateAsync(order);

        if (!updated)
            return ServiceResponse.Error("Не вдалося оновити замовлення");

        return ServiceResponse.Success("Статус оновлено");
    }

    public async Task<ServiceResponse> GetMyOrdersAsync(long userId)
    {
        var orders = await orderRepository
            .GetAll()
            .Where(o => o.BuyerId == userId)
            .Include(o => o.Seller)
            .OrderByDescending(o => o.CreateDate)
            .ProjectTo<BuyerOrderDto>(mapper.ConfigurationProvider)
            .ToListAsync();

        var mapped = mapper.Map<List<BuyerOrderDto>>(orders);

        return ServiceResponse.Success("Перелік моїх замовлень як покупця отримано", mapped);
    }

    public async Task<ServiceResponse> GetSellerOrdersAsync(long sellerId)
    {
        var orders = await orderRepository
            .GetAll()
            .Where(o => o.SellerId == sellerId)
            .OrderByDescending(o => o.CreateDate)
            .ProjectTo<SellerOrderDto>(mapper.ConfigurationProvider)
            .ToListAsync();

        var mapped = mapper.Map<List<SellerOrderDto>>(orders);

        return ServiceResponse.Success($"Перелік моїм замовлень як продавця отримано", mapped);
    }

    public async Task<ServiceResponse> CancelAsync(long orderId, long userId)
    {
        var order = await orderRepository.GetByIdAsync(orderId);

        if (order == null)
            return ServiceResponse.Error("Замовлення не знайдено");

        var isBuyer = order.BuyerId == userId;
        var isSeller = order.SellerId == userId;

        if (!isBuyer && !isSeller)
            return ServiceResponse.Error("Ви не маєте доступу до цього замовлення");

        if (order.Status == OrderStatus.Completed)
            return ServiceResponse.Error("Завершене замовлення не можна скасувати");

        if (isBuyer && order.Status != OrderStatus.Pending)
            return ServiceResponse.Error("Покупець може скасувати лише замовлення зі статусом Pending");

        order.Status = OrderStatus.Canceled;
        order.UpdatedAt = DateTime.UtcNow;

        var updated = await orderRepository.UpdateAsync(order);

        if (!updated)
            return ServiceResponse.Error("Не вдалося скасувати замовлення");

        return ServiceResponse.Success("Замовлення скасовано");
    }


    private bool IsValidStatusTransition(OrderStatus current, OrderStatus next)
    {
        return current switch
        {
            OrderStatus.Pending => next == OrderStatus.Accepted
                                   || next == OrderStatus.Canceled,

            OrderStatus.Accepted => next == OrderStatus.Completed
                                     || next == OrderStatus.Canceled,

            OrderStatus.Completed => false, // фінальний статус

            OrderStatus.Canceled => false, // фінальний статус

            _ => false
        };
    }
}

