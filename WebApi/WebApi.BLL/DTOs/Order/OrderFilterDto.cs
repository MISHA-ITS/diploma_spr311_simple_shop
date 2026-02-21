using System;
using System.Collections.Generic;
using System.Linq;
using WebApi.DAL.Enums;

namespace WebApi.BLL.DTOs.Order;

public class OrderFilterDto
{
    public OrderStatus? Status { get; set; }

    public DateTime? DateFrom { get; set; }
    public DateTime? DateTo { get; set; }

    public int PageNumber { get; set; } = 1;
    public int PageSize { get; set; } = 10;
}
