using WebApi.DAL.Entities;

namespace WebApi.DAL.Repositories.advertisements
{
    public interface IAdvertisementRepository : IGenericRepository<AdvertisementEntity, long>
    {
        Task<bool> CreateRangeAsync(IEnumerable<AdvertisementEntity> advertisements);
    }
}
