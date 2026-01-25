using Microsoft.AspNetCore.Mvc;
using WebApi.BLL.DTOs.Category;
using WebApi.BLL.Services.Category;

namespace WebApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CategoryController(ICategoryService categoryService) : ControllerBase
{
    [HttpPost("create")]
    public async Task<IActionResult> Create([FromForm] CreateCategoryDTO dto)
    {
        var responce = await categoryService.CreateAsync(dto);
        return responce.IsSuccess ? Ok(responce) : BadRequest(responce);
    }

    [HttpDelete("delete/{id}")]
    public async Task<IActionResult> Delete(long id)
    {
        var responce = await categoryService.DeleteAsync(id);
        return responce.IsSuccess ? Ok(responce) : BadRequest(responce);
    }

    [HttpGet("list")]
    public async Task<IActionResult> GetAll()
    {
        var responce = await categoryService.GetAllAsync();
        return responce.IsSuccess ? Ok(responce) : BadRequest(responce);
    }

    [HttpGet("page")]
    public async Task<IActionResult> GetPage(int page = 1, int size = 10, string? searchName ="", string? parentName="")
    {
        var result = await categoryService.GetPageAsync(page, size ,searchName, parentName);
        return Ok(result);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(long id)
    {
        var responce = await categoryService.GetByIdAsync(id);
        return responce.IsSuccess ? Ok(responce) : BadRequest(responce);
    }

    [HttpPut("update")]
    public async Task<IActionResult> Update([FromForm] UpdateCategoryDTO dto)
    {
        var responce = await categoryService.UpdateAsync(dto);
        return responce.IsSuccess ? Ok(responce) : BadRequest(responce);
    }
}
