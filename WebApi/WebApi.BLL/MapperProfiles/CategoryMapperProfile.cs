using AutoMapper;
using WebApi.BLL.DTOs.Category;
using WebApi.DAL.Entities;

namespace WebApi.BLL.MapperProfiles;

public class CategoryMapperProfile : Profile
{
    public CategoryMapperProfile()
    {
        //CreateCategoryDTO -> CategoryEntity
        CreateMap<CreateCategoryDTO, CategoryEntity>()
            .ForMember(dest => dest.ImageUrl, opt => opt.Ignore());

        //UpdateCategoryDTO -> CategoryEntity
        CreateMap<UpdateCategoryDTO, CategoryEntity>()
            .ForMember(dest => dest.ImageUrl, opt => opt.Ignore());

        //CategoryEntity -> CategoryDTO
        CreateMap<CategoryEntity, CategoryDTO>();

        CreateMap<SeederCategoryDTO, CategoryEntity>()
            .ForMember(dest => dest.Slug, opt => opt.MapFrom(src => src.urlSlug));
    }
}
