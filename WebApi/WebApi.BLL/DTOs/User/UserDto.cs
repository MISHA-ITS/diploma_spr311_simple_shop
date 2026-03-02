using WebApi.BLL.DTOs.Advertisement;

namespace WebApi.BLL.DTOs.User;

public class UserDTO
{
    public long Id { get; set; }
    public string? FirstName { get; set; } = string.Empty;
    public string? LastName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string PhoneNumber { get; set; } = null!;
    public string? Image { get; set; }
    public DateTime DateCreated { get; set; }
    public DateTime DateOnline { get; set; }
    public DateTimeOffset? LockoutEnd { get; set; }
    public string[] Roles { get; set; } = [];
    public ICollection<AdvertisementDTO>? FavoriteAdverts { get; set; } = new List<AdvertisementDTO>();
}
