using AutoMapper;
using WebApi.BLL.DTOs.Role;
using WebApi.DAL.Entities.Identity;

namespace WebApi.BLL.MapperProfiles;

public class RoleMapperProfile : Profile
{
    public RoleMapperProfile()
    {
        // CreateRoleDto -> AppRole
        CreateMap<CreateRoleDto, AppRole>();
        
        // UpdateRoleDto -> AppRole
        CreateMap<UpdateRoleDto, AppRole>();

        // AppRole -> RoleDto
        CreateMap<AppRole, RoleDto>();
    }
}