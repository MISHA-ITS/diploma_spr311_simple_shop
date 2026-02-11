namespace WebApi.DAL.Enums;

public enum OrderStatus
{
    Pending,        // створено, очікує підтвердження
    Accepted,       // продавець прийняв
    Rejected,       // продавець відхилив
    Shipped,        // відправлено
    Completed,      // успішно завершено
    Canceled        // скасовано
}
