using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using WebApi.DAL.Entities.NewPostEntities;

namespace WebApi.DAL.EntityConfigs.NewPost;

public class SettlementConfig : IEntityTypeConfiguration<Settlement>
{
    public void Configure(EntityTypeBuilder<Settlement> builder)
    {
        builder.Property(x => x.Region)
            .HasConversion(
                v => string.IsNullOrWhiteSpace(v) ? null : v
                , v => v
            );

        builder.HasMany(x => x.Adverts)
            .WithOne(x => x.Settlement)
            .HasForeignKey(x => x.SettlementRef)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
