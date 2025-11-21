using Microsoft.AspNetCore.Http;

namespace WebApi.BLL.Services.Image;

public interface IImageService
{
    Task<string> SaveImageAsync(IFormFile file, string folder);
    Task<string> SaveImageFromUrlAsync(string imageUrl, string folder);
    Task<string> SaveImageFromBase64Async(string input, string folder);
    Task DeleteImageAsync(string name, string folder);
}