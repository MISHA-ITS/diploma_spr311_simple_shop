using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WebApi.BLL.DTOs.Order;
using WebApi.BLL.Services.Order;

namespace WebApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class OrderController(IOrderService orderService) : ControllerBase
    {
        [HttpPost]
        public async Task<IActionResult> CreateAsync([FromBody] CreateOrderDto dto)
        {
            var buyerId = long.Parse(User.Claims.First(c => c.Type == "id").Value);
            var response = await orderService.CreateAsync(dto, buyerId);
            return response.IsSuccess ? Ok(response) : BadRequest(response);
        }
    }
}
