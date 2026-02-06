using System;
using System.Collections.Generic;
using System.Linq;
namespace WebApi.BLL.DTOs.User;

public class UserFilterDto
{
    public int PageNumber { get; set; }
    public int PageSize { get; set; }

    public string? Search { get; set; }
    public bool? IsLocked { get; set; }

    public List<string>? Roles { get; set; }
}

