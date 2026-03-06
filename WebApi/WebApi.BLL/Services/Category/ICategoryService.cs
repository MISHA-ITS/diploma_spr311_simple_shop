using WebApi.BLL.DTOs.Category;

namespace WebApi.BLL.Services.Category
{
    public interface ICategoryService
    {
        Task<ServiceResponse> CreateAsync(CreateCategoryDTO dto);
        Task<ServiceResponse> UpdateAsync(UpdateCategoryDTO dto);
        Task<ServiceResponse> DeleteAsync(long id);
        Task<ServiceResponse> GetByIdAsync(long id);
        Task<ServiceResponse> GetAllAsync();
        Task<ServiceResponse> GetPageAsync(int page, int size, string? searchName = "", string? parentName = "");
        Task<ServiceResponse> GetCategoriesWithCountsAsync();
    }
}
