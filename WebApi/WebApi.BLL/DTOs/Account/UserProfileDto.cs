using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WebApi.BLL.DTOs.Account;

public class UserProfileDto
{
    public string FullName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string? Image { get; set; }
    public string DateCreated { get; set; } = string.Empty;
    public string DateOnline { get; set; } = string.Empty;
    public string[] Roles { get; set; } = [];
}
