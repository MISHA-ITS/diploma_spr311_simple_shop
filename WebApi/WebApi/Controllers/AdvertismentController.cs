using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using WebApi.BLL.DTOs.Advertisement;
using WebApi.BLL.Services.Advertisement;

namespace WebApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AdvertismentController(IAdvertisementService advertisementService) : ControllerBase
{
    [Authorize]
    [HttpPost("create")]
    public async Task<IActionResult> Create([FromForm] CreateAdvertisementDTO dto)
    {
        var userIdClaim = User.FindFirstValue("id");
        var currentUserId = long.Parse(userIdClaim!);

        var response = await advertisementService.CreateAsync(dto, currentUserId);
        return response.IsSuccess ? Ok(response) : BadRequest(response);
    }

    [HttpDelete("delete/{id}")]
    public async Task<IActionResult> Delete(long id)
    {
        var responce = await advertisementService.DeleteAsync(id);
        return responce.IsSuccess ? Ok(responce) : BadRequest(responce);
    }

    [HttpGet("list")]
    public async Task<IActionResult> GetAll([FromQuery] AdvertisementFilterDto filter)
    {
        var responce = await advertisementService.GetAllAsync(filter);
        return responce.IsSuccess ? Ok(responce) : BadRequest(responce);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(long id)
    {
        var responce = await advertisementService.GetByIdAsync(id);
        return responce.IsSuccess ? Ok(responce) : BadRequest(responce);
    }

    [HttpPut("update")]
    public async Task<IActionResult> Update([FromForm] UpdateAdvertisementDTO dto)
    {
        var responce = await advertisementService.UpdateAsync(dto);
        return responce.IsSuccess ? Ok(responce) : BadRequest(responce);
    }
}
