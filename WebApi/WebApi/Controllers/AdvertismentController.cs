using Microsoft.AspNetCore.Mvc;
using WebApi.BLL.DTOs.advertisement;
using WebApi.BLL.Services.advertisement;

namespace WebApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AdvertismentController(IAdvertisementService advertisementService) : ControllerBase
{
    [HttpPost("create")]
    public async Task<IActionResult> Create([FromForm] CreateAdvertisementDTO dto)
    {
        var response = await advertisementService.CreateAsync(dto);
        return response.IsSuccess ? Ok(response) : BadRequest(response);
    }

    [HttpDelete("delete/{id}")]
    public async Task<IActionResult> Delete(long id)
    {
        var responce = await advertisementService.DeleteAsync(id);
        return responce.IsSuccess ? Ok(responce) : BadRequest(responce);
    }

    [HttpGet("list")]
    public async Task<IActionResult> GetAll([FromQuery] advertisementFilterDto filter)
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
