using Microsoft.AspNetCore.Mvc;
using WebApi.BLL.DTOs.Product;
using WebApi.BLL.Services.Product;

namespace WebApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ProductController(IProductService productService) : ControllerBase
{
    [HttpPost("create")]
    public async Task<IActionResult> Create([FromForm] CreateProductDTO dto)
    {
        var response = await productService.CreateAsync(dto);
        return response.IsSuccess ? Ok(response) : BadRequest(response);
    }

    [HttpDelete("delete/{id}")]
    public async Task<IActionResult> Delete(long id)
    {
        var responce = await productService.DeleteAsync(id);
        return responce.IsSuccess ? Ok(responce) : BadRequest(responce);
    }

    [HttpGet("list")]
    public async Task<IActionResult> GetAll([FromQuery] ProductFilterDto filter)
    {
        var responce = await productService.GetAllAsync(filter);
        return responce.IsSuccess ? Ok(responce) : BadRequest(responce);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(long id)
    {
        var responce = await productService.GetByIdAsync(id);
        return responce.IsSuccess ? Ok(responce) : BadRequest(responce);
    }

    [HttpPut("update")]
    public async Task<IActionResult> Update([FromForm] UpdateProductDTO dto)
    {
        var responce = await productService.UpdateAsync(dto);
        return responce.IsSuccess ? Ok(responce) : BadRequest(responce);
    }
}
