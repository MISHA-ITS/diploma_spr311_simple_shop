using AutoMapper;
using WebApi.BLL.DTOs.Account;
using WebApi.BLL.DTOs.Seeder;
using WebApi.BLL.DTOs.User;
using WebApi.DAL.Entities.Identity;

namespace WebApi.BLL.MapperProfiles;

public class UserMapperProfile : Profile
{
    public UserMapperProfile()
    {
        //SeederUserDTO -> AppUser
        CreateMap<SeederUserDto, AppUser>()
            .ForMember(opt => opt.UserName, opt => opt.MapFrom(x => x.Email));

        //CreateUserDTO -> AppUser
        CreateMap<CreateUserDto, AppUser>()
            .ForMember(dest => dest.Image, opt => opt.Ignore());

        //UpdateUserDTO -> AppUser
        CreateMap<UpdateUserDto, AppUser>()
            .ForMember(dest => dest.Image, opt => opt.Ignore());

        //UserEntity -> UserDTO
        CreateMap<AppUser, UserDTO>();

        //GoogleAccoun -> UserDTO
        CreateMap<GoogleAccountDto, UserDTO>()
            .ForMember(dest => dest.Id, opt => opt.Ignore()) // Google не повертає ID із вашої БД
            .ForMember(dest => dest.FirstName, opt => opt.MapFrom(src => src.FirstName))
            .ForMember(dest => dest.LastName, opt => opt.MapFrom(src => src.LastName))
            .ForMember(dest => dest.Email, opt => opt.MapFrom(src => src.Email))
            .ForMember(dest => dest.Image, opt => opt.MapFrom(src => src.Picture))
            .ForMember(dest => dest.Roles, opt => opt.Ignore()) // ролі не приходять із Google
            .ForMember(dest => dest.DateCreated, opt => opt.Ignore())
            .ForMember(dest => dest.DateOnline, opt => opt.Ignore());
    }
}
