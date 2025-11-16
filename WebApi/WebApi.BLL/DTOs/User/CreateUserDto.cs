using Microsoft.AspNetCore.Http;
namespace WebApi.BLL.DTOs.User;

public class CreateUserDto
{
    public required string Email { get; set; }
    public required string Password { get; set; }
    public string? FirstName { get; set; }
    public string? LastName { get; set; }
    public IFormFile? Image { get; set; }
}
