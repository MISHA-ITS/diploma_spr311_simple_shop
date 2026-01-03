
namespace WebApi.BLL.Services;

public class ServiceResponse
{
    public bool IsSuccess { get; set; }
    public string Message { get; set; } = string.Empty;
    public object? Payload { get; set; }

    public static ServiceResponse Success(string message, object? payLoad = null)
    {
        return new ServiceResponse
        {
            IsSuccess = true,
            Message = message,
            Payload = payLoad
        };
    }

    public static ServiceResponse Error(string message, object? payLoad = null)
    {
        return new ServiceResponse
        {
            IsSuccess = false,
            Message = message,
            Payload = payLoad
        };
    }
}
