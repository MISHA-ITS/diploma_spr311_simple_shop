using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using WebApi.DAL.Entities.NewPostEntities;

namespace WebApi.DAL.EntityConfigs.NewPost;

public class RegionConfig : IEntityTypeConfiguration<Region>
{
    public void Configure(EntityTypeBuilder<Region> builder)
    {
        builder.HasMany(x => x.Settlements)
            .WithOne(x => x.SettlementRegion)
            .HasForeignKey(x => x.Region)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
