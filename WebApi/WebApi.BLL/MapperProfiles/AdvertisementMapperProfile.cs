using AutoMapper;
using System.Globalization;
using WebApi.BLL.DTOs.Advertisement;
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
            .ForMember(dest => dest.Images, opt => opt.MapFrom(src => src.Images))
            .ForMember(dest => dest.UpdateDate, opt => opt.MapFrom(src => src.UpdateDate.ToString("dd MMMM yyyy 'р.'", new CultureInfo("uk-UA"))));
       
        CreateMap<AdvertisementImageEntity, AdvertisementImageDTO>()
            .ForMember(dest => dest.ImageUrl, opt => opt.MapFrom(src => src.ImageUrl))
            .ForMember(dest => dest.IsMain, opt => opt.MapFrom(src => src.IsMain));

        CreateMap<SeederAdvertisementDTO, AdvertisementEntity>()
            .ForMember(dest => dest.Images, opt => opt.Ignore())
            .ForMember(dest => dest.User, opt => opt.Ignore())
            .ForMember(dest => dest.CategoryId, opt => opt.Ignore());
    }
}
