using AutoMapper;
using WebApi.BLL.DTOs.Advertisement;
using WebApi.BLL.Services.NewPost;
using WebApi.DAL.Entities;

namespace WebApi.BLL.MapperProfiles;
public class AdvertisementMapperProfile : Profile
{
    public AdvertisementMapperProfile()
    {
        //CreateAdvertisementDTO -> AdvertisementEntity
        CreateMap<CreateAdvertisementDTO, AdvertisementEntity>()
            .ForMember(dest => dest.Images, opt => opt.Ignore());

        //UpdateAdvertisementEntity -> AdvertisementEntity
        CreateMap<UpdateAdvertisementDTO, AdvertisementEntity>()
            .ForMember(dest => dest.Images, opt => opt.Ignore());

        //AdvertisementEntity -> AdvertisementDTO
        CreateMap<AdvertisementEntity, AdvertisementDTO>()
            .ForMember(dest => dest.SettlementRef, opt => opt.MapFrom(src => src.SettlementRef))
            .ForMember(dest => dest.Images, opt => opt.MapFrom(src => src.Images.Select(i => i.ImageUrl)));
        
        CreateMap<SeederAdvertisementDTO, AdvertisementEntity>()
            .ForMember(dest => dest.Images, opt => opt.Ignore())
            .ForMember(dest => dest.User, opt => opt.Ignore())
            .ForMember(dest => dest.CategoryId, opt => opt.Ignore());
    }
}
