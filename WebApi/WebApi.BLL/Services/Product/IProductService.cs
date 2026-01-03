using WebApi.BLL.DTOs.Product;

namespace WebApi.BLL.Services.Product
{
    public interface IProductService
    {
        Task<ServiceResponse> CreateAsync(CreateProductDTO dto);
        Task<ServiceResponse> UpdateAsync(UpdateProductDTO dto);
        Task<ServiceResponse> DeleteAsync(long id);
        Task<ServiceResponse> GetByIdAsync(long id);
        Task<ServiceResponse> GetAllAsync(ProductFilterDto filter);
    }
}
