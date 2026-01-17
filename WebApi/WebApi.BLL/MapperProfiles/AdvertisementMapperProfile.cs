using AutoMapper;
using WebApi.BLL.DTOs.advertisement;
using WebApi.DAL.Entities;

namespace WebApi.BLL.MapperProfiles;
public class AdvertisementMapperProfile : Profile
{
    public AdvertisementMapperProfile()
    {
        //CreateAdvertisementDTO -> AdvertisementEntity
        CreateMap<CreateAdvertisementDTO, AdvertisementEntity>()
            .ForMember(dest => dest.Images, opt => opt.Ignore())
            .ForMember(dest => dest.Categories, opt => opt.Ignore());

        //UpdateAdvertisementEntity -> AdvertisementEntity
        CreateMap<UpdateAdvertisementDTO, AdvertisementEntity>()
            .ForMember(dest => dest.Images, opt => opt.Ignore())
            .ForMember(dest => dest.Categories, opt => opt.Ignore());

        //AdvertisementEntity -> AdvertisementDTO
        CreateMap<AdvertisementEntity, advertisementDTO>()
            .ForMember(dest => dest.Categories, opt => opt.MapFrom(src => src.Categories.Select(c => c.Name)))
            .ForMember(dest => dest.Images, opt => opt.MapFrom(src => src.Images.Select(i => i.ImageUrl)));

        CreateMap<SeederAdvertisementDTO, AdvertisementEntity>()
            .ForMember(dest => dest.Images, opt => opt.Ignore())
            .ForMember(dest => dest.Categories, opt => opt.Ignore());
    }
}
