using Microsoft.AspNetCore.Mvc;
using WebApi.BLL.Services.NewPost;

namespace WebApi.Controllers;

[Route("api/[controller]")]
[ApiController]
public class NewPostController(INewPostService newPostService) : ControllerBase
{
    [HttpGet("areas")]
    public async Task<ActionResult> GetAreas() => Ok(await newPostService.GetAreasAsync());

    [HttpGet("regions")]
    public async Task<ActionResult> GetRegions() => Ok(await newPostService.GetRegionsAsync());

    [HttpGet("settlement")]
    public async Task<ActionResult> GetSettlement() => Ok(await newPostService.GetSettlementsAsync());

    [HttpGet("areas/regions")]
    public async Task<ActionResult> GetRegions([FromQuery] string areaRef) => Ok(await newPostService.GetRegionsByAreaAsync(areaRef));

    [HttpGet("areas/settlements")]
    public async Task<ActionResult> GetSettlementsByArea([FromQuery] string areaRef) => Ok(await newPostService.GetSettlementsByAreaAsync(areaRef));

    [HttpGet("region/settlements")]
    public async Task<ActionResult> GetSettlements([FromQuery] string regionRef) => Ok(await newPostService.GetSettlementsByRegionAsync(regionRef));

    [HttpGet("settlements/warehouses")]
    public async Task<ActionResult> GetWarehouses([FromQuery] string settlementRef) =>
        Ok(await newPostService.GetWarehousesBySettlementAsync(settlementRef));

    [HttpGet("settlements")]
    public async Task<ActionResult> GetSettlement([FromQuery] string settlementRef) => Ok(await newPostService.GetSettlement(settlementRef));

    [HttpGet("areas/area")]
    public async Task<IActionResult> GetAreaById([FromQuery] string areaRef) => Ok(await newPostService.GetAreaByIdAsync(areaRef));

    [HttpPost("update")]
    public async Task<ActionResult> UpdateData()
    {
        await newPostService.UpdateNewPostData();
        return Ok();
    }
}
