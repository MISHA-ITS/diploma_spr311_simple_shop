using AutoMapper;
using WebApi.BLL.DTOs.Product;
using WebApi.DAL.Entities;

namespace WebApi.BLL.MapperProfiles;
public class ProductMapperProfile : Profile
{
    public ProductMapperProfile()
    {
        //CreateProductDTO -> ProductEntity
        CreateMap<CreateProductDTO, ProductEntity>()
            .ForMember(dest => dest.Images, opt => opt.Ignore())
            .ForMember(dest => dest.Categories, opt => opt.Ignore());

        //UpdateProductDTO -> ProductEntity
        CreateMap<UpdateProductDTO, ProductEntity>()
            .ForMember(dest => dest.Images, opt => opt.Ignore())
            .ForMember(dest => dest.Categories, opt => opt.Ignore());

        //ProductEntity -> ProductDTO
        CreateMap<ProductEntity, ProductDTO>()
            .ForMember(dest => dest.Categories, opt => opt.MapFrom(src => src.Categories.Select(c => c.Name)))
            .ForMember(dest => dest.Images, opt => opt.MapFrom(src => src.Images.Select(i => i.ImageUrl)));

        CreateMap<SeederProductDTO, ProductEntity>()
            .ForMember(dest => dest.Images, opt => opt.Ignore())
            .ForMember(dest => dest.Categories, opt => opt.Ignore());
    }
}
