using Microsoft.EntityFrameworkCore;

namespace WebApi.DAL;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {

    }
}
