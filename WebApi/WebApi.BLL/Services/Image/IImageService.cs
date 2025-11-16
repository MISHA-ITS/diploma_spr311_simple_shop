using Microsoft.AspNetCore.Http;

namespace WebApi.BLL.Services.Image;

public interface IImageService
{
    public interface IImageService
    {
        Task<string?> SaveImageAsync(IFormFile image, string filePath);
        void DeleteImage(string directory);

        Task<List<string>> SaveProductImagesAsync(List<IFormFile> images, string path);
    }
}
