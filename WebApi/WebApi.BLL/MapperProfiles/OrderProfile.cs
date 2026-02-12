
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

        CreateMap<OrderEntity, OrderResponseDto>()
            .ForMember(d => d.AdvertisementName, o => o.MapFrom(s => s.Advertisement.Name));
    }
}
