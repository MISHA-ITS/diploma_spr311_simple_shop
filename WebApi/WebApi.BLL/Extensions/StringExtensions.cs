using Slugify;

namespace WebApi.BLL.Extensions;

public static class StringExtensions
{
    private static readonly SlugHelper _slugHelper;

    static StringExtensions()
    {
        var config = new SlugHelperConfiguration();

        // Українська транслітерація
        config.StringReplacements.Add("а", "a");
        config.StringReplacements.Add("б", "b");
        config.StringReplacements.Add("в", "v");
        config.StringReplacements.Add("г", "h");
        config.StringReplacements.Add("ґ", "g");
        config.StringReplacements.Add("д", "d");
        config.StringReplacements.Add("е", "e");
        config.StringReplacements.Add("є", "ye");
        config.StringReplacements.Add("ж", "zh");
        config.StringReplacements.Add("з", "z");
        config.StringReplacements.Add("и", "y");
        config.StringReplacements.Add("і", "i");
        config.StringReplacements.Add("ї", "yi");
        config.StringReplacements.Add("й", "y");
        config.StringReplacements.Add("к", "k");
        config.StringReplacements.Add("л", "l");
        config.StringReplacements.Add("м", "m");
        config.StringReplacements.Add("н", "n");
        config.StringReplacements.Add("о", "o");
        config.StringReplacements.Add("п", "p");
        config.StringReplacements.Add("р", "r");
        config.StringReplacements.Add("с", "s");
        config.StringReplacements.Add("т", "t");
        config.StringReplacements.Add("у", "u");
        config.StringReplacements.Add("ф", "f");
        config.StringReplacements.Add("х", "kh");
        config.StringReplacements.Add("ц", "ts");
        config.StringReplacements.Add("ч", "ch");
        config.StringReplacements.Add("ш", "sh");
        config.StringReplacements.Add("щ", "shch");
        config.StringReplacements.Add("ю", "yu");
        config.StringReplacements.Add("я", "ya");

        _slugHelper = new SlugHelper(config);
    }

    /// <summary>
    /// Перетворює рядок у SEO-slug з підтримкою української мови
    /// </summary>
    public static string ToSlug(this string value)
    {
        if (string.IsNullOrWhiteSpace(value))
            return string.Empty;

        return _slugHelper.GenerateSlug(value);
    }
}
