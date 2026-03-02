using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using WebApi.BLL.DTOs.Advertisement;

namespace WebApi.BLL.Models.Account;

public class UserProfileModel
{
    public long Id { get; set; }
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string FullName { get; set; } = string.Empty;
    public string? Image { get; set; } = null;
    public string Email { get; set; } = string.Empty;
    public string PhoneNumber { get; set; } = string.Empty;
    public string CreatedAt { get; set; } = string.Empty;
    public string[] Roles { get; set; } = null!;
    public ICollection<AdvertisementDTO>? FavoriteAdverts { get; set; } = new List<AdvertisementDTO>();
}
