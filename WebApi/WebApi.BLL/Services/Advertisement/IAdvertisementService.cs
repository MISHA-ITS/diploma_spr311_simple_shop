using WebApi.BLL.DTOs.Advertisement;

namespace WebApi.BLL.Services.Advertisement
{
    public interface IAdvertisementService
    {
        Task<ServiceResponse> CreateAsync(CreateAdvertisementDTO dto);
        Task<ServiceResponse> UpdateAsync(UpdateAdvertisementDTO dto);
        Task<ServiceResponse> DeleteAsync(long id);
        Task<ServiceResponse> GetByIdAsync(long id);
        Task<ServiceResponse> GetAllAsync(AdvertisementFilterDto filter);
    }
}
