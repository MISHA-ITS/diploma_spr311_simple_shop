
using AutoMapper;
using WebApi.BLL.DTOs.Order;
using WebApi.DAL.Entities;

namespace WebApi.BLL.MapperProfiles;

public class OrderProfile : Profile
{
    public OrderProfile()
    {
        CreateMap<CreateOrderDto, OrderEntity>()
            .ForMember(d => d.BuyerFirstName, o => o.MapFrom(s => s.FirstName))
            .ForMember(d => d.BuyerLastName, o => o.MapFrom(s => s.LastName))
            .ForMember(d => d.BuyerPhone, o => o.MapFrom(s => s.PhoneNumber))
            .ForMember(d => d.BuyerEmail, o => o.MapFrom(s => s.Email))

            // серверні поля — ігноруємо
            .ForMember(d => d.Id, o => o.Ignore())
            .ForMember(d => d.BuyerId, o => o.Ignore())
            .ForMember(d => d.SellerId, o => o.Ignore())
            .ForMember(d => d.AdvertisementId, o => o.Ignore())
            .ForMember(d => d.Price, o => o.Ignore())
            .ForMember(d => d.Status, o => o.Ignore())
            .ForMember(d => d.TrackingNumber, o => o.Ignore())
            .ForMember(d => d.UpdatedAt, o => o.Ignore());

        // 🔹 BASE
        CreateMap<OrderEntity, BaseOrderDto>()
            .ForMember(d => d.AdvertisementName,
                o => o.MapFrom(s => s.Advertisement.Name))
            .ForMember(d => d.Price,
                o => o.MapFrom(s => s.Price))
            .ForMember(d => d.Status,
                o => o.MapFrom(s => s.Status))
            .ForMember(d => d.CreateDate,
                o => o.MapFrom(s => s.CreateDate))
                .ForMember(d => d.AdvertisementImage,
                o => o.MapFrom(s =>
                    s.Advertisement.Images
                        .Select(i => i.ImageUrl)
                        .FirstOrDefault()));

        // Buyer
        CreateMap<OrderEntity, BuyerOrderDto>()
            .IncludeBase<OrderEntity, BaseOrderDto>()
            .ForMember(d => d.SellerFullName,
                o => o.MapFrom(s => s.Seller.FirstName + " " + s.Seller.LastName));

        // Seller
        CreateMap<OrderEntity, SellerOrderDto>()
            .IncludeBase<OrderEntity, BaseOrderDto>()
            .ForMember(d => d.BuyerFullName,
                o => o.MapFrom(s => s.Buyer.FirstName + " " + s.Buyer.LastName));

        // List
        CreateMap<OrderEntity, OrderResponseDto>()
            .IncludeBase<OrderEntity, BaseOrderDto>()
            .ForMember(d => d.BuyerId,
                o => o.MapFrom(s => s.BuyerId))
            .ForMember(d => d.SellerId,
                o => o.MapFrom(s => s.SellerId))
            .ForMember(d => d.AdvertisementId,
                o => o.MapFrom(s => s.AdvertisementId))
            .ForMember(d => d.BuyerFullName,
                o => o.MapFrom(s => s.Buyer.FirstName + " " + s.Buyer.LastName))
            .ForMember(d => d.SellerFullName,
                o => o.MapFrom(s => s.Seller.FirstName + " " + s.Seller.LastName));

        // DETAILS
        CreateMap<OrderEntity, OrderDetailsDto>()
            .ForMember(d => d.AdvertisementName,
                o => o.MapFrom(s => s.Advertisement.Name))
            .ForMember(d => d.AdvertisementImage,
                o => o.MapFrom(s =>
                    s.Advertisement.Images
                        .Select(i => i.ImageUrl)
                        .FirstOrDefault()))
            // Buyer
            .ForMember(d => d.BuyerFirstName,
                o => o.MapFrom(s => s.Buyer.FirstName))
            .ForMember(d => d.BuyerLastName,
                o => o.MapFrom(s => s.Buyer.LastName))
            .ForMember(d => d.BuyerPhone,
                o => o.MapFrom(s => s.Buyer.PhoneNumber))
            // BUYER LOCATION
            .ForMember(d => d.BuyerLocation,
                o => o.MapFrom(s =>
                    s.City == null
                        ? null
                        : s.City +
                            (s.NewPostWarehouse != null
                                ? ", відділення " + s.NewPostWarehouse
                                : s.DeliveryAddress != null
                                    ? ", " + s.DeliveryAddress
                                    : "")))

            // Seller
            .ForMember(d => d.SellerFirstName,
                o => o.MapFrom(s => s.Seller.FirstName))
            .ForMember(d => d.SellerLastName,
                o => o.MapFrom(s => s.Seller.LastName))
            .ForMember(d => d.SellerPhone,
                o => o.MapFrom(s => s.Seller.PhoneNumber))
            // SELLER LOCATION
            .ForMember(d => d.SellerLocation,
                o => o.MapFrom(s =>
                    s.Advertisement.Settlement != null
                        ? s.Advertisement.Settlement.Description
                        : null
                ));
    }
}
