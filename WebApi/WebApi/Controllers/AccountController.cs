using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WebApi.BLL.DTOs.Account;
using WebApi.BLL.Services.Account;
using WebApi.BLL.Services.User;

namespace WebApi.Controllers;

[ApiController]
[Route("api/account")]
public class AccountController(IAccountService accountService,
    IUserService userService) : ControllerBase
{

    [HttpPost("register")]
    public async Task<IActionResult> RegisterAsync([FromForm] RegisterDto dto)
    {
        var user = await accountService.RegisterAsync(dto);

        if (user == null)
        {
            return BadRequest("Register error");
        }

        return Ok(user);
    }

    [HttpPost("login")]
    public async Task<IActionResult> LoginAsync([FromBody] LoginDto dto)
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

    [HttpPost("googleLogin")]
    public async Task<IActionResult> GoogleLogin([FromBody] GoogleLoginRequestDto model)
    {
        var result = await accountService.LoginByGoogleAsync(model.Token);

        if (!result.IsSuccess)
            return BadRequest(result);

        return Ok(result);
    }

    [HttpPost("forgot-password")]
    public async Task<IActionResult> ForgotPasswordAsync([FromBody] ForgotPasswordDto dto)
    {
        var response = await accountService.ForgotPasswordAsync(dto);
        return response.IsSuccess ? Ok(response) : BadRequest(response);
    }

    [HttpPost("validate-reset-token")]
    public async Task<IActionResult> ValidateResetTokenAsync([FromBody] ValidateResetTokenDto dto)
    {
        var response = await accountService.ValidateResetTokenAsync(dto);
        return response.IsSuccess ? Ok(response) : BadRequest(response);
    }

    [HttpPost("reset-password")]
    public async Task<IActionResult> ResetPasswordAsync([FromBody] ResetPasswordDto dto)
    {
        var response = await accountService.ResetPasswordAsync(dto);
        return response.IsSuccess ? Ok(response) : BadRequest(response);
    }

    [HttpGet("profile")]
    [Authorize]
    public async Task<IActionResult> Profile()
    {
        var userId = await accountService.GetUserIdAsync();
        var userInfo = await userService.GetByIdAsync(userId.ToString());

        return Ok(userInfo);
    }
}
