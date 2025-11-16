using Microsoft.EntityFrameworkCore;
using WebApi.DAL.Entities;

namespace WebApi.DAL.Repositories;

public class GenericRepository<TEntity, TId>(AppDbContext context) : IGenericRepository<TEntity, TId>
    where TEntity : class, IBaseEntity<TId>
    where TId : notnull
{
    public virtual async Task<bool> CreateAsync(TEntity entity)
    {
        entity.CreateDate = DateTime.UtcNow;
        entity.UpdateDate = DateTime.UtcNow;
        object value = await context.Set<TEntity>().AddAsync(entity);
        var result = await context.SaveChangesAsync();
        return result != 0;
    }

    public virtual async Task<bool> DeleteAsync(TEntity entity)
    {
        entity.UpdateDate = DateTime.UtcNow;
        object value = context.Set<TEntity>().Remove(entity);
        var result = await context.SaveChangesAsync();
        return result != 0;
    }

    public virtual IQueryable<TEntity> GetAll()
    {
        return context.Set<TEntity>();
    }

    public virtual async Task<TEntity?> GetByIdAsync(TId id)
    {
        var result = await context.Set<TEntity>()
            .FirstOrDefaultAsync(e => e.Id.Equals(id));
        return result;
    }

    public virtual async Task<bool> UpdateAsync(TEntity entity)
    {
        entity.UpdateDate = DateTime.UtcNow;
        object value = context.Set<TEntity>().Update(entity);
        var result = await context.SaveChangesAsync();
        return result != 0;
    }
}
