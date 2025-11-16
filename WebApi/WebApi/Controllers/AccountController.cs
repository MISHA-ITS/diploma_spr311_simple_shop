using Microsoft.AspNetCore.Mvc;
using WebApi.BLL.DTOs.Account;
using WebApi.BLL.Services.Account;

namespace WebApi.Controllers;

[ApiController]
[Route("api/account")]
public class AccountController(IAccountService accountService) : ControllerBase
{

    [HttpPost("register")]
    public async Task<IActionResult> RegisterAsync(RegisterDto dto)
    {
        var user = await accountService.RegisterAsync(dto);

        if (user == null)
        {
            return BadRequest("Register error");
        }

        return Ok(user);
    }

    [HttpPost("login")]
    public async Task<IActionResult> LoginAsync(LoginDto dto)
    {

        var response = await accountService.LoginAsync(dto);
        return response.IsSuccess ? Ok(response) : BadRequest(response);
    }
}
