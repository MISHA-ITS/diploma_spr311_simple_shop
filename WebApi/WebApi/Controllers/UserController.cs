using Microsoft.AspNetCore.Mvc;
using WebApi.BLL.DTOs.User;
using WebApi.BLL.Services.User;

namespace WebApi.Controllers;

[ApiController]
[Route("api/user")]
public class UserController(IUserService userService) : ControllerBase
{
    [HttpPost]
    public async Task<IActionResult> CreateAsync([FromForm] CreateUserDto dto)
    {
        var response = await userService.CreateAsync(dto);
        return response.IsSuccess ? Ok(response) : BadRequest(response);
    }

    [HttpGet]
    public async Task<IActionResult> GetAsync(string? id)
    {
        if (string.IsNullOrEmpty(id))
        {
            return BadRequest("id is required!");
        }

        var response = await userService.GetByIdAsync(id);
        return response?.IsSuccess == true ? Ok(response) : BadRequest(response);
    }

    [HttpPut]
    public async Task<IActionResult> UpdateAsync(UpdateUserDto dto)
    {
        var response = await userService.UpdateAsync(dto);
        return response.IsSuccess ? Ok(response) : BadRequest(response);
    }

    [HttpDelete]
    public async Task<IActionResult> DeleteAsync(string? id)
    {
        if (string.IsNullOrEmpty(id))
        {
            return BadRequest("id is required!");
        }

        var response = await userService.DeleteAsync(id);
        return response.IsSuccess ? Ok(response) : BadRequest(response);
    }

    [HttpGet("List")]
    public async Task<IActionResult> GetAllAsync()
    {
        var response = await userService.GetAllAsync();
        return response.IsSuccess ? Ok(response) : BadRequest(response);
    }
}
