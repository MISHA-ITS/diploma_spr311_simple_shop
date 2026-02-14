
using AutoMapper;
using WebApi.BLL.DTOs.Order;
using WebApi.DAL.Entities.Identity;

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
                o => o.MapFrom(s => s.CreateDate));

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
            .ForMember(d => d.AdvertisementId,
                o => o.MapFrom(s => s.AdvertisementId))
            .ForMember(d => d.BuyerFullName,
                o => o.MapFrom(s => s.Buyer.FirstName + " " + s.Buyer.LastName))
            .ForMember(d => d.SellerFullName,
                o => o.MapFrom(s => s.Seller.FirstName + " " + s.Seller.LastName));
    }
}
