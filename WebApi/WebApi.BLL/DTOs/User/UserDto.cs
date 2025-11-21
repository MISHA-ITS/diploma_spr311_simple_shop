using Microsoft.AspNetCore.Http;
namespace WebApi.BLL.DTOs.User;

public class UserDTO
{
    public long Id { get; set; }
    public string? FirstName { get; set; } = string.Empty;
    public string? LastName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string? Image { get; set; }
    public DateTime DateCreated { get; set; }
    public DateTime DateOnline { get; set; }
    public string[] Roles { get; set; } = [];
}
