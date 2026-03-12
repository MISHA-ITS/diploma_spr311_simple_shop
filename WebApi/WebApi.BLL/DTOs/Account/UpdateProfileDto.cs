using Microsoft.AspNetCore.Http;

namespace WebApi.BLL.DTOs.Account;

public class UpdateProfileDto
{
    public string? FirstName { get; set; }
    public string? LastName { get; set; }
    public string? PhoneNumber { get; set; }
    public IFormFile? Image { get; set; }
}
