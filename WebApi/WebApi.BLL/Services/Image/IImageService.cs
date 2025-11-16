using Microsoft.AspNetCore.Http;

namespace WebApi.BLL.Services.Image;

public interface IImageService
{
    Task<string?> SaveImageAsync(IFormFile image, string directory);

    void DeleteImage(string filePath);

    Task<List<string>> SaveProductImagesAsync(List<IFormFile> images, string path);
}