using AutoMapper;
using Microsoft.AspNetCore.Identity;
using WebApi.BLL.DTOs.Role;

namespace WebApi.BLL.MapperProfiles;

public class RoleMapperProfile : Profile
{
    public RoleMapperProfile()
    {
        //CreateRoleDTO -> RoleEntity
        CreateMap<CreateRoleDto, IdentityRole>();

        //UpdateRoleDTO -> RoleEntity
        CreateMap<UpdateRoleDto, IdentityRole>();

        //RoleEntity -> RoleDTO
        CreateMap<IdentityRole, RoleDto>();
    }
}
