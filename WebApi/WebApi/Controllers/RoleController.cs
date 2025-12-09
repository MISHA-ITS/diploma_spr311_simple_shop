using Microsoft.AspNetCore.Mvc;
using WebApi.BLL.DTOs.Role;
using WebApi.BLL.Services.Role;

namespace WebApi.Controllers;

[ApiController]
[Route("api/[controller]/[action]")]
public class RoleController(IRoleService roleService) : ControllerBase
{
    [HttpPost]
    public async Task<IActionResult> CreateAsync([FromForm] CreateRoleDto dto)
    {
        var response = await roleService.CreateAsync(dto);
        return response.IsSuccess ? Ok(response) : BadRequest(response);
    }

    [HttpGet]
    public async Task<IActionResult> GetAsync(long? id)
    {
        if (id == null)
            return BadRequest("Id is required.");

        var response = await roleService.GetByIdAsync(id.Value);
        return response.IsSuccess ? Ok(response) : NotFound(response);
    }

    [HttpPut]
    public async Task<IActionResult> UpdateAsync([FromForm] UpdateRoleDto dto)
    {
        var response = await roleService.UpdateAsync(dto);
        return response.IsSuccess ? Ok(response) : BadRequest(response);
    }

    [HttpDelete]
    public async Task<IActionResult> DeleteAsync(long id)
    {
        if (id <= 0)
            return BadRequest("Id is required and must be greater than 0!");

        var response = await roleService.DeleteAsync(id);
        return response.IsSuccess ? Ok(response) : BadRequest(response);
    }

    [HttpGet("list")]
    public async Task<IActionResult> GetAllAsync()
    {
        var response = await roleService.GetAllAsync();
        return response.IsSuccess ? Ok(response) : BadRequest(response);
    }
}

