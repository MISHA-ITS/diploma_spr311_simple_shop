using WebApi.BLL.DTOs.NewPost;
using WebApi.DAL.Entities.NewPostEntities;

namespace WebApi.BLL.Services.NewPost;

public interface INewPostService : IDisposable
{
    Task<IEnumerable<Area>> GetAreasDataAsync();
    Task<IEnumerable<Settlement>> GetSettlementsDataAsync(IEnumerable<Region> regions);
    Task<IEnumerable<SettlementDto>> GetSettlementsByAreaAsync(string areaRef);
    Task<IEnumerable<Region>> GetRegionsDataAsync(IEnumerable<string> areaRefs);
    Task<IEnumerable<AreaDto>> GetAreasAsync();
    Task<IEnumerable<SettlementDto>> GetSettlementsAsync();
    Task<IEnumerable<WarehousDto>> GetWarehousesBySettlementAsync(string settlementRef);
    Task<IEnumerable<SettlementDto>> GetSettlementsByRegionAsync(string regionRef);
    Task<IEnumerable<RegionDto>> GetRegionsAsync();
    Task<IEnumerable<RegionDto>> GetRegionsByAreaAsync(string areaRef);
    Task<SettlementDto> GetSettlement(string settlementRef);
    Task UpdateNewPostData();
}
