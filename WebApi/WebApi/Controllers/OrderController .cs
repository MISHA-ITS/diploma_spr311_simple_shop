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

        [HttpGet("{id}")]
        [Authorize]
        public async Task<IActionResult> GetById(long id)
        {
            var userId = GetUserId();
            var result = await orderService.GetByIdAsync(id, userId);
            return Ok(result);
        }

        //[HttpGet]
        //[Authorize(Roles = "Admin")]
        //public async Task<IActionResult> GetAll()
        //{
        //    var result = await orderService.GetAllAsync();
        //    return Ok(result);
        //}

        [HttpGet]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetAll([FromQuery] OrderFilterDto? filter)
        {
            filter ??= new OrderFilterDto();

            var result = await orderService.GetAllAsync(filter);

            return Ok(result);
        }

        [HttpPatch("{id}/status")]
        [Authorize]
        public async Task<IActionResult> UpdateStatus(long id, [FromBody] UpdateOrderStatusDto dto)
        {
            var userId = GetUserId();
            var result = await orderService.UpdateStatusAsync(id, dto, userId);
            return Ok(result);
        }

        [HttpGet("buyer")]
        [Authorize]
        public async Task<IActionResult> GetMyBuyerOrders()
        {
            var userId = GetUserId();
            var result = await orderService.GetMyOrdersAsync(userId);
            return Ok(result);
        }

        [HttpGet("seller")]
        [Authorize]
        public async Task<IActionResult> GetMySellerOrders()
        {
            var userId = GetUserId();
            var result = await orderService.GetSellerOrdersAsync(userId);
            return Ok(result);
        }

        [HttpPatch("{id}/cancel")]
        [Authorize]
        public async Task<IActionResult> Cancel(long id)
        {
            var userId = GetUserId();
            var result = await orderService.CancelAsync(id, userId);
            return Ok(result);
        }

        private long GetUserId()
        {
            var userIdClaim = User.FindFirst("id")?.Value;

            if (string.IsNullOrEmpty(userIdClaim))
                throw new Exception("User Id not found in token");

            return long.Parse(userIdClaim);
        }
    }
}
