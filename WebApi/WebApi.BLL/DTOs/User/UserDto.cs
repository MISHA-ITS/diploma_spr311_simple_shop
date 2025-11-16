using Microsoft.AspNetCore.Http;
namespace WebApi.BLL.DTOs.User;

public class UserDTO
{
    public long Id { get; set; }
    public string? FirstName { get; set; } = string.Empty;
    public string? LastName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public IFormFile? Image { get; set; }
    public string[] Roles { get; set; } = [];
}
