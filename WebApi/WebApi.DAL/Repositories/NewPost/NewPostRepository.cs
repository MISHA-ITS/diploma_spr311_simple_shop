using Microsoft.EntityFrameworkCore;
using System.Linq.Expressions;
using WebApi.DAL.Entities.NewPostEntities;

namespace WebApi.DAL.Repositories.NewPost;

public class NewPostRepository<TEntity> : INewPostRepository<TEntity>
    where TEntity : NewPostBaseEntity
{
    private readonly AppDbContext context;
    private readonly DbSet<TEntity> dbSet;

    public NewPostRepository(AppDbContext context)
    {
        this.context = context;
        this.dbSet = context.Set<TEntity>();
    }

    public IQueryable<TEntity> GetQuery(
        QueryTrackingBehavior tracking = QueryTrackingBehavior.NoTracking)
        => dbSet.AsTracking(tracking);

    public async Task<bool> AnyAsync(Expression<Func<TEntity, bool>> predicate)
        => await dbSet.AnyAsync(predicate);

    public async Task<TEntity?> GetByRefAsync(string refId)
        => await dbSet.FirstOrDefaultAsync(x => x.Ref == refId);

    public async Task AddAsync(TEntity entity)
        => await dbSet.AddAsync(entity);

    public async Task AddRangeAsync(IEnumerable<TEntity> entities)
        => await dbSet.AddRangeAsync(entities);

    public async Task SaveAsync()
        => await context.SaveChangesAsync();
}
