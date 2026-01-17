using WebApi.DAL.Entities.NewPostEntities;

namespace WebApi.BLL.Models.NewPost;

public class NewPostData
{
    public IEnumerable<Area> Areas = [];
    public IEnumerable<Settlement> Settlements = [];
    public IEnumerable<Region> Regions = [];
}
