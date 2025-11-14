using Microsoft.AspNetCore.Mvc;
using WebApi.BLL.DTOs.Role;
using WebApi.BLL.Services.Role;

namespace WebApi.Controllers;

[ApiController]
[Route("api/role")]
public class RoleController(IRoleService roleService) : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> GetAsync(long? id)
    {
        if (id == null)
            return BadRequest("Id is required.");

        var result = await roleService.GetByIdAsync(id.Value);

        return result == null ? NotFound("Role not found.") : Ok(result);
    }

    [HttpGet("list")]
    public async Task<IActionResult> GetAllAsync()
    {
        var result = await roleService.GetAllAsync();
        return Ok(result);
    }

    [HttpDelete]
    public async Task<IActionResult> DeleteAsync(long id)
    {
        if (id <= 0)
            return BadRequest("Invalid id.");

        var result = await roleService.DeleteAsync(id);
        return result ? Ok("Role deleted") : NotFound("Role not found.");
    }

    [HttpPost]
    public async Task<IActionResult> CreateAsync([FromForm]CreateRoleDto dto)
    {
        var result = await roleService.CreateAsync(dto);
        return result ? Ok("Role created successfully.")
                      : BadRequest("Failed to create role.");
    }

    [HttpPut]
    public async Task<IActionResult> UpdateAsync([FromForm]UpdateRoleDto dto)
    {
        var result = await roleService.UpdateAsync(dto);
        return result ? Ok("Role updated successfully.")
                      : BadRequest("Failed to update role.");
    }
}

