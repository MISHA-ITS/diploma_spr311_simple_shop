using WebApi.DAL.Entities;

namespace WebApi.DAL.Repositories.Category;

public class CategoryRepository(AppDbContext context) : 
    GenericRepository<CategoryEntity, long>(context), ICategoryRepository
{

}
