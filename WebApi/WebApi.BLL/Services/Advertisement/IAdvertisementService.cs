using WebApi.BLL.DTOs.Advertisement;

namespace WebApi.BLL.Services.Advertisement
{
    public interface IAdvertisementService
    {
        Task<ServiceResponse> CreateAsync(CreateAdvertisementDTO dto, long userId);
        Task<ServiceResponse> UpdateAsync(UpdateAdvertisementDTO dto);
        Task<ServiceResponse> DeleteAsync(long id);
        Task<ServiceResponse> GetByIdAsync(long id);
        Task<ServiceResponse> GetAllAsync(AdvertisementDTO filter);
        Task<ServiceResponse> GetByUserIdAsync(long userId);
    }
}
