namespace WebApi.BLL;

public static class Settings
{
    public static string RootPath { get; private set; } = null!;
    public static string ImagesPath { get; private set; } = null!;  

    public const string CategoriesDir = "categories";
    public const string UsersDir = "users";
    public const string AdvertisementsDir = "advertisements";

    public static void Init(string rootPath, string imagePath)
    {
        RootPath = rootPath;
        ImagesPath = imagePath;
    }
}