using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using WebApi.DAL.Entities;

namespace WebApi.DAL.Repositories;

public class GenericRepository<TEntity, TId>
    (AppDbContext context, ILogger<GenericRepository<TEntity, TId>> logger) 
    : IGenericRepository<TEntity, TId>
    where TEntity : class, IBaseEntity<TId>
    where TId : notnull
{
    protected readonly AppDbContext _context = context;
    protected readonly ILogger<GenericRepository<TEntity, TId>> _logger = logger;

    public virtual async Task<bool> CreateAsync(TEntity entity)
    {
        entity.CreateDate = DateTime.UtcNow;
        entity.UpdateDate = DateTime.UtcNow;

        try
        {
            await _context.Set<TEntity>().AddAsync(entity);
            var result = await _context.SaveChangesAsync();

            if (result > 0)
            {
                _logger.LogInformation("Created entity of type {EntityType} with Id {EntityId}", typeof(TEntity).Name, entity.Id);
                return true;
            }

            _logger.LogWarning("Failed to create entity of type {EntityType} with Id {EntityId}", typeof(TEntity).Name, entity.Id);
            return false;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Exception while creating entity of type {EntityType}", typeof(TEntity).Name);
            return false;
        }
    }

    public virtual async Task<bool> DeleteAsync(TEntity entity)
    {
        entity.UpdateDate = DateTime.UtcNow;

        try
        {
            _context.Set<TEntity>().Remove(entity);
            var result = await _context.SaveChangesAsync();

            if (result > 0)
            {
                _logger.LogInformation("Deleted entity of type {EntityType} with Id {EntityId}", typeof(TEntity).Name, entity.Id);
                return true;
            }

            _logger.LogWarning("Failed to delete entity of type {EntityType} with Id {EntityId}", typeof(TEntity).Name, entity.Id);
            return false;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Exception while deleting entity of type {EntityType} with Id {EntityId}", typeof(TEntity).Name, entity.Id);
            return false;
        }
    }

    public virtual IQueryable<TEntity> GetAll(QueryTrackingBehavior tracking = QueryTrackingBehavior.NoTracking)
    {
        _logger.LogDebug("Fetching all entities of type {EntityType}", typeof(TEntity).Name);
        return _context.Set<TEntity>().AsTracking(tracking);
    }

    public virtual async Task<TEntity?> GetByIdAsync(TId id)
    {
        try
        {
            var result = await _context.Set<TEntity>().FirstOrDefaultAsync(e => e.Id.Equals(id));

            if (result != null)
            {
                _logger.LogDebug("Fetched entity of type {EntityType} with Id {EntityId}", typeof(TEntity).Name, id);
            }
            else
            {
                _logger.LogWarning("Entity of type {EntityType} with Id {EntityId} not found", typeof(TEntity).Name, id);
            }

            return result;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Exception while fetching entity of type {EntityType} with Id {EntityId}", typeof(TEntity).Name, id);
            return null;
        }
    }

    public virtual async Task<bool> UpdateAsync(TEntity entity)
    {
        entity.UpdateDate = DateTime.UtcNow;

        try
        {
            _context.Set<TEntity>().Update(entity);
            var result = await _context.SaveChangesAsync();

            if (result > 0)
            {
                _logger.LogInformation("Updated entity of type {EntityType} with Id {EntityId}", typeof(TEntity).Name, entity.Id);
                return true;
            }

            _logger.LogWarning("Failed to update entity of type {EntityType} with Id {EntityId}", typeof(TEntity).Name, entity.Id);
            return false;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Exception while updating entity of type {EntityType} with Id {EntityId}", typeof(TEntity).Name, entity.Id);
            return false;
        }
    }
}
