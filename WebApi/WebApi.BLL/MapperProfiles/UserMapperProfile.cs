using AutoMapper;
using WebApi.BLL.DTOs.User;
using WebApi.DAL.Entities.Identity;

namespace WebApi.BLL.MapperProfiles;

public class UserMapperProfile : Profile
{
    public UserMapperProfile()
    {
        //CreateUserDTO -> AppUser
        CreateMap<CreateUserDto, AppUser>()
            .ForMember(dest => dest.Image, opt => opt.Ignore());

        //UpdateUserDTO -> AppUser
        CreateMap<UpdateUserDto, AppUser>()
            .ForMember(dest => dest.Image, opt => opt.Ignore());

        //UserEntity -> UserDTO
        CreateMap<AppUser, UserDTO>();
    }
}
