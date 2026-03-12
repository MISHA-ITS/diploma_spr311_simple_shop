using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using WebApi.BLL.DTOs.User;
using WebApi.BLL.Services.Account;
using WebApi.BLL.Services.User;

namespace WebApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class UserController(IUserService userService, IAccountService accountService) : ControllerBase
{
    [HttpPost]
    public async Task<IActionResult> CreateAsync([FromForm] CreateUserDto dto)
    {
        var response = await userService.CreateAsync(dto);
        return response.IsSuccess ? Ok(response) : BadRequest(response);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetAsync(long id)
    {
        var response = await userService.GetByIdAsync(id);
        return response?.IsSuccess == true ? Ok(response) : BadRequest(response);
    }

    [HttpPut]
    public async Task<IActionResult> UpdateAsync([FromForm] UpdateUserDto dto)
    {
        var response = await userService.UpdateAsync(dto);
        return response.IsSuccess ? Ok(response) : BadRequest(response);
    }

    [HttpDelete]
    public async Task<IActionResult> DeleteAsync(long id)
    {
        var response = await userService.DeleteAsync(id);
        return response.IsSuccess ? Ok(response) : BadRequest(response);
    }

    [HttpGet("List")]
    public async Task<IActionResult> GetAllAsync([FromQuery] UserFilterDto filter)
    {
        var response = await userService.GetAllAsync(filter);
        return response.IsSuccess ? Ok(response) : BadRequest(response);
    }

    [HttpPost("Lock")]
    public async Task<IActionResult> Lock(long id)
    {
        var response = await userService.LockUserAsync(id);
        return response.IsSuccess ? Ok(response) : BadRequest(response);
    }
    [HttpPost("Unlock")]
    public async Task<IActionResult> Unlock(long id)
    {
        var response = await userService.UnlockUserAsync(id);
        return response.IsSuccess ? Ok(response) : BadRequest(response);
    }
    [Authorize]
    [HttpPost("favorites/{advertId}")]
    public async Task<IActionResult> AddToFavorites(long advertId)
    {
        var userId = await accountService.GetUserIdAsync();

        var result = await userService.AddFavoriteAdvert(userId, advertId);
        return result.IsSuccess ? Ok(result) : BadRequest(result);
    }

    [Authorize]
    [HttpDelete("favorites/{advertId}")]
    public async Task<IActionResult> RemoveFromFavorites(long advertId)
    {
        var userId = await accountService.GetUserIdAsync();

        var result = await userService.RemoveFavoriteAdvert(userId, advertId);
        return result.IsSuccess ? Ok(result) : BadRequest(result);
    }
    [Authorize]
    [HttpDelete("favorites/all")]
    public async Task<IActionResult> ClearFavorites()
    {
        var userId = await accountService.GetUserIdAsync();

        var result = await userService.RemoveAllFavorites(userId);
        return result.IsSuccess ? Ok(result) : BadRequest(result);
    }

    [Authorize]
    [HttpGet("favorites")]
    public async Task<IActionResult> GetAllFavorites()
    {
        var userId = await accountService.GetUserIdAsync();

        var result = await userService.GetAllFavoritesAsync(userId);
        return result.IsSuccess ? Ok(result) : BadRequest(result);
    }
}
