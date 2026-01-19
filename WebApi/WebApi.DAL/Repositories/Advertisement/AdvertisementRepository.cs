using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using WebApi.DAL.Entities;

namespace WebApi.DAL.Repositories.Advertisements;

public class AdvertisementRepository(AppDbContext context, ILogger<GenericRepository<AdvertisementEntity, long>> logger) :
    GenericRepository<AdvertisementEntity, long>(context, logger), IAdvertisementRepository
{
    public async Task<bool> CreateRangeAsync(IEnumerable<AdvertisementEntity> advertisements)
    {
        if (advertisements == null || !advertisements.Any())
        {
            _logger.LogWarning("CreateRangeAsync called with empty advertisements collection");
            return false;
        }

        var now = DateTime.UtcNow;

        foreach (var advertisement in advertisements)
        {
            advertisement.CreateDate = now;
            advertisement.UpdateDate = now;
        }

        try
        {
            await _context.Advertisements.AddRangeAsync(advertisements);
            var result = await _context.SaveChangesAsync();

            if (result > 0)
            {
                _logger.LogInformation("Successfully created {Count} advertisements", advertisements.Count());
                return true;
            }
            else
            {
                _logger.LogWarning("Failed to create advertisements. No records saved.");
                return false;
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Exception occurred while creating {Count} advertisements", advertisements.Count());
            return false;
        }
    }

    public override IQueryable<AdvertisementEntity> GetAll(QueryTrackingBehavior tracking = QueryTrackingBehavior.NoTracking)
    {
        _logger.LogDebug("Fetching all advertisements with related Images and Categories");
        return _context.Set<AdvertisementEntity>()
            .AsTracking(tracking)
            .Include(p => p.Images)
            .Include(p => p.Categories)
            .AsSplitQuery();
    }

    public override async Task<AdvertisementEntity?> GetByIdAsync(long id)
    {
        try
        {
            var advertisement = await _context.Advertisements
                .Include(p => p.Images)
                .Include(p => p.Categories)
                .AsSplitQuery()
                .FirstOrDefaultAsync(x => x.Id == id);

            if (advertisement != null)
                _logger.LogDebug("Fetched advertisement with Id {AdvertisementId}", id);
            else
                _logger.LogWarning("Advertisement with Id {AdvertisementId} not found", id);

            return advertisement;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Exception occurred while fetching advertisement with Id {AdvertisementId}", id);
            return null;
        }
    }
}