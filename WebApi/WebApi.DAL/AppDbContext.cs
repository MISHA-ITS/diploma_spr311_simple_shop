using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using WebApi.DAL.Entities;
using WebApi.DAL.Entities.Identity;
using WebApi.DAL.Entities.NewPostEntities;

namespace WebApi.DAL;

public class AppDbContext
    : IdentityDbContext<
        AppUser, AppRole, long,
        AppUserClaim, AppUserRole, AppUserLogin,
        AppRoleClaim, AppUserToken>
{
    public AppDbContext(DbContextOptions options)
        : base(options) { }

    public DbSet<CategoryEntity> Categories { get; set; }
    public DbSet<AdvertisementEntity> Advertisements { get; set; }
    public DbSet<AdvertisementImageEntity> AdvertisementImages { get; set; }
    public DbSet<Area> Areas { get; set; }
    public DbSet<Region> Regions { get; set; }
    public DbSet<Settlement> Settlements { get; set; }
    public DbSet<OrderEntity> Orders { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.ApplyConfigurationsFromAssembly(typeof(AppDbContext).Assembly);

        modelBuilder.Entity<AppUser>(b =>
        {
            // Each User can have many UserClaims
            b.HasMany(e => e.Claims)
                .WithOne(e => e.User)
                .HasForeignKey(uc => uc.UserId)
                .IsRequired();

            // Each User can have many UserLogins
            b.HasMany(e => e.Logins)
                .WithOne(e => e.User)
                .HasForeignKey(ul => ul.UserId)
                .IsRequired();

            // Each User can have many UserTokens
            b.HasMany(e => e.Tokens)
                .WithOne(e => e.User)
                .HasForeignKey(ut => ut.UserId)
                .IsRequired();

            // Each User can have many entries in the UserRole join table
            b.HasMany(e => e.UserRoles)
                .WithOne(e => e.User)
                .HasForeignKey(ur => ur.UserId)
                .IsRequired();

            b.HasOne(e => e.Settlement)
                .WithMany(s => s.Users)
                .HasForeignKey(e => e.SettlementRef)
                .HasPrincipalKey(s => s.Ref)
                .OnDelete(DeleteBehavior.SetNull);
        });

        modelBuilder.Entity<AppRole>(b =>
        {
            // Each Role can have many entries in the UserRole join table
            b.HasMany(e => e.UserRoles)
                .WithOne(e => e.Role)
                .HasForeignKey(ur => ur.RoleId)
                .IsRequired();

            // Each Role can have many associated RoleClaims
            b.HasMany(e => e.RoleClaims)
                .WithOne(e => e.Role)
                .HasForeignKey(rc => rc.RoleId)
                .IsRequired();
        });

        modelBuilder.Entity<AdvertisementEntity>()
            .HasOne(a => a.Settlement)
                .WithMany(s => s.Adverts)
                .HasForeignKey(a => a.SettlementRef)
                .HasPrincipalKey(s => s.Ref)
                .OnDelete(DeleteBehavior.SetNull);

        modelBuilder.Entity<AdvertisementImageEntity>()
            .HasOne(ai => ai.Advertisement)
                .WithMany(a => a.Images)
                .HasForeignKey(ai => ai.AdvertisementId)
                .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<AdvertisementEntity>()
            .HasOne(a => a.User) 
            .WithMany()
            .HasForeignKey(a => a.UserId);

        modelBuilder.Entity<AdvertisementEntity>()
            .HasMany(a => a.Users)
            .WithMany(u => u.Adverts) 
            .UsingEntity(j => j.ToTable("UserFavoriteAdverts"));
    }
}
