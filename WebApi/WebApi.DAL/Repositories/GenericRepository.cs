using Microsoft.EntityFrameworkCore;
using WebApi.DAL.Entities;

namespace WebApi.DAL.Repositories;

public class GenericRepository<TEntity, TId> : IGenericRepository<TEntity, TId>
    where TEntity : class, IBaseEntity<TId>
    where TId : notnull
{
    private readonly AppDbContext _context;

    public GenericRepository(AppDbContext context)
    {
        _context = context;
    }

    public virtual async Task<bool> CreateAsync(TEntity entity)
    {
        entity.CreateDate = DateTime.UtcNow;
        entity.UpdateDate = DateTime.UtcNow;
        object value = await _context.Set<TEntity>().AddAsync(entity);
        var result = await _context.SaveChangesAsync();
        return result != 0;
    }

    public virtual async Task<bool> DeleteAsync(TEntity entity)
    {
        entity.UpdateDate = DateTime.UtcNow;
        object value = _context.Set<TEntity>().Remove(entity);
        var result = await _context.SaveChangesAsync();
        return result != 0;
    }

    public virtual IQueryable<TEntity> GetAll()
    {
        return _context.Set<TEntity>();
    }

    public virtual async Task<TEntity?> GetByIdAsync(TId id)
    {
        var result = await _context.Set<TEntity>()
            .FirstOrDefaultAsync(e => e.Id.Equals(id));
        return result;
    }

    public virtual async Task<bool> UpdateAsync(TEntity entity)
    {
        entity.UpdateDate = DateTime.UtcNow;
        object value = _context.Set<TEntity>().Update(entity);
        var result = await _context.SaveChangesAsync();
        return result != 0;
    }
}
