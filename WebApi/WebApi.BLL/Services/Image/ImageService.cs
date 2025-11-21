using Microsoft.AspNetCore.Http;
using SixLabors.ImageSharp;
using SixLabors.ImageSharp.Formats.Webp;
using SixLabors.ImageSharp.Processing;
using Microsoft.Extensions.Configuration;
using Org.BouncyCastle.Asn1.X509;

namespace WebApi.BLL.Services.Image;

public class ImageService(IConfiguration configuration) : IImageService
{
    public async Task DeleteImageAsync(string name, string folder)
    {
        var sizes = configuration.GetRequiredSection("ImageSizes").Get<List<int>>();

        var dir = Path.Combine(Directory.GetCurrentDirectory(), configuration["ImagesDir"]!, folder);

        Task[] tasks = sizes
            .AsParallel()
            .Select(size =>
            {
                return Task.Run(() =>
                {
                    var path = Path.Combine(dir, $"{size}_{name}");
                    if (File.Exists(path))
                    {
                        File.Delete(path);
                    }
                });
            })
            .ToArray();

        await Task.WhenAll(tasks);
    }

    public async Task<string> SaveImageFromUrlAsync(string imageUrl)
    {
        using var httpClient = new HttpClient();
        var imageBytes = await httpClient.GetByteArrayAsync(imageUrl);
        //return await SaveImageAsync(imageBytes);
        throw new InvalidOperationException("SaveImageFromUrlAsync must be called with a folder!");
    }


    public async Task<string> SaveImageAsync(IFormFile file, string folder)
    {
        using MemoryStream ms = new();
        await file.CopyToAsync(ms);
        var bytes = ms.ToArray();

        var imageName = await SaveImageAsync(bytes, folder);
        return imageName;
    }

    private async Task<string> SaveImageAsync(byte[] bytes, string folder)
    {
        string imageName = $"{Path.GetRandomFileName()}.webp";
        var sizes = configuration.GetRequiredSection("ImageSizes").Get<List<int>>();

        var baseDir = configuration["ImagesDir"]!;

        string folderPath = Path.Combine(Directory.GetCurrentDirectory(), baseDir, folder);

        if (!Directory.Exists(folderPath))
            Directory.CreateDirectory(folderPath);

        Task[] tasks = sizes
            .AsParallel()
            .Select(s => SaveImageAsync(bytes, imageName, s, folder))
            .ToArray();

        await Task.WhenAll(tasks);

        return imageName;
    }

    public async Task<string> SaveImageFromBase64Async(string input, string folder)
    {
        var base64Data = input.Contains(",")
           ? input.Substring(input.IndexOf(",") + 1)
           : input;

        byte[] imageBytes = Convert.FromBase64String(base64Data);

        return await SaveImageAsync(imageBytes, folder);
        //return await SaveImageInternalAsync(bytes, folder);
    }

    private async Task SaveImageAsync(byte[] bytes, string name, int size, string folder)
    {
        var ImagesDir = configuration["ImagesDir"]!;

        // wwwroot/images/users, etc.
        var targetDir = Path.Combine(Directory.GetCurrentDirectory(), ImagesDir, folder);

        // Створюємо папку якщо її немає
        if (!Directory.Exists(targetDir))
            Directory.CreateDirectory(targetDir);

        var path = Path.Combine(targetDir, $"{size}_{name}");

        using var image = SixLabors.ImageSharp.Image.Load(bytes);
        image.Mutate(imgConext =>
        {
            imgConext.Resize(new ResizeOptions
            {
                Size = new Size(size, size),
                Mode = ResizeMode.Max
            });
        });
        await image.SaveAsync(path, new WebpEncoder());
    }
}
