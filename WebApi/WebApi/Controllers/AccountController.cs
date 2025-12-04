using Microsoft.AspNetCore.Mvc;
using WebApi.BLL.DTOs.Account;
using WebApi.BLL.Services.Account;

namespace WebApi.Controllers;

[ApiController]
[Route("api/account")]
public class AccountController(IAccountService accountService) : ControllerBase
{

    [HttpPost("register")]
    public async Task<IActionResult> RegisterAsync([FromForm]RegisterDto dto)
    {
        var user = await accountService.RegisterAsync(dto);

        if (user == null)
        {
            return BadRequest("Register error");
        }

        return Ok(user);
    }

    [HttpPost("login")]
    public async Task<IActionResult> LoginAsync([FromForm]LoginDto dto)
    {
        var response = await accountService.LoginAsync(dto);
        return response.IsSuccess ? Ok(response) : BadRequest(response);
    }

    [HttpGet("confirmEmail")]
    public async Task<IActionResult> ConfirmEmail(string? userId, string? token)
    {
        if (string.IsNullOrWhiteSpace(userId) || string.IsNullOrWhiteSpace(token))
        {
            return BadRequest("Некоректний запит на підтвердження електронної пошти.");
        }

        var response = await accountService.ConfirmEmailAsync(userId, token);

        if (response.IsSuccess)
        {
            return Redirect("http://Localhost:3000");
        }

        return BadRequest(response);
    }
}
