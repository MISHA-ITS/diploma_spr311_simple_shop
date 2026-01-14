using WebApi.BLL.DTOs.advertisement;

namespace WebApi.BLL.Services.advertisement
{
    public interface IAdvertisementService
    {
        Task<ServiceResponse> CreateAsync(CreateAdvertisementDTO dto);
        Task<ServiceResponse> UpdateAsync(UpdateAdvertisementDTO dto);
        Task<ServiceResponse> DeleteAsync(long id);
        Task<ServiceResponse> GetByIdAsync(long id);
        Task<ServiceResponse> GetAllAsync(advertisementFilterDto filter);
    }
}
