using System.ComponentModel.DataAnnotations;

namespace WebApi.DAL.Entities;

public interface IBaseEntity<T>
{
    T Id { get; set; }
    DateTime CreateDate { get; set; }
    DateTime UpdateDate { get; set; }
}

public class BaseEntity<T> : IBaseEntity<T>
{
    [Key]
    virtual public T Id { get; set; } = default!;
    public DateTime CreateDate { get; set; } = DateTime.UtcNow;
    public DateTime UpdateDate { get; set; } = DateTime.UtcNow;
}
