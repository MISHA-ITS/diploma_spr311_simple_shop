using WebApi.DAL.Entities.NewPostEntities;
using Microsoft.EntityFrameworkCore;
using System.Linq.Expressions;

namespace WebApi.DAL.Repositories.NewPost;

public interface INewPostRepository<TEntity>
    where TEntity : NewPostBaseEntity
{
    IQueryable<TEntity> GetQuery(
        QueryTrackingBehavior tracking = QueryTrackingBehavior.NoTracking);

    Task<bool> AnyAsync(Expression<Func<TEntity, bool>> predicate);

    Task<TEntity?> GetByRefAsync(string refId);

    Task AddAsync(TEntity entity);

    Task AddRangeAsync(IEnumerable<TEntity> entities);

    Task SaveAsync();
}
