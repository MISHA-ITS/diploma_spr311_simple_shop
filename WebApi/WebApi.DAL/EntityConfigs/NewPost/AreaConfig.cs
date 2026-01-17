using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using WebApi.DAL.Entities.NewPostEntities;

namespace WebApi.DAL.EntityConfigs.NewPost;

public class AreaConfig : IEntityTypeConfiguration<Area>
{
    public void Configure(EntityTypeBuilder<Area> builder)
    {
        builder.HasMany(x => x.Regions)
            .WithOne(x => x.Area)
            .HasForeignKey(x => x.AreaRef)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
