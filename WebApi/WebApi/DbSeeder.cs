using AutoMapper;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using System.Text.Json;
using WebApi.BLL;
using WebApi.BLL.Constatnts;
using WebApi.BLL.DTOs.Category;
using WebApi.BLL.DTOs.Product;
using WebApi.BLL.DTOs.Seeder;
using WebApi.BLL.Services;
using WebApi.BLL.Services.Image;
using WebApi.BLL.Services.Product;
using WebApi.DAL;
using WebApi.DAL.Entities;
using WebApi.DAL.Entities.Identity;
using WebApi.DAL.Repositories.Category;
using WebApi.DAL.Repositories.Products;

namespace WebApi;

public static class DbSeeder
{
    public static async Task SeedData(this WebApplication webApplication)
    {
        using var scope = webApplication.Services.CreateScope();
        //Цей об'єкт буде верта посилання на конткетс, який зараєстрвоано в Program.cs
        var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();
        var roleManager = scope.ServiceProvider.GetRequiredService<RoleManager<AppRole>>();
        var userManager = scope.ServiceProvider.GetRequiredService<UserManager<AppUser>>();
        var mapper = scope.ServiceProvider.GetRequiredService<IMapper>();
        var categoryRepository = scope.ServiceProvider.GetRequiredService<ICategoryRepository>();
        var productRopository = scope.ServiceProvider.GetRequiredService<IProductRepository>();
        var imageService = scope.ServiceProvider.GetRequiredService<IImageService>();

        context.Database.Migrate();

        if (!context.Roles.Any())
        {
            foreach (var roleName in Roles.AllRoles)
            {
                var result = await roleManager.CreateAsync(new(roleName));
                if (!result.Succeeded)
                {
                    Console.WriteLine("Error Create Role {0}", roleName);
                }
            }
        }

        if (!context.Users.Any())
        {
            
            var jsonFile = Path.Combine(Directory.GetCurrentDirectory(), "Helpers", "JsonData", "Users.json");
            if (File.Exists(jsonFile))
            {
                var jsonData = await File.ReadAllTextAsync(jsonFile);
                try
                {
                    var users = JsonSerializer.Deserialize<List<SeederUserDto>>(jsonData);
                    if (users == null) return;

                    foreach (var user in users)
                    {
                        var entity = mapper.Map<AppUser>(user);
                        entity.UserName = user.Email;
                        entity.Image = await imageService.SaveImageFromUrlAsync(user.Image, Settings.UsersDir);
                        var result = await userManager.CreateAsync(entity, user.Password);
                        if (!result.Succeeded)
                        {
                            Console.WriteLine("Error Create User {0}", user.Email);
                            continue;
                        }
                        foreach (var role in user.Roles)
                        {
                            if (await roleManager.RoleExistsAsync(role))
                            {
                                await userManager.AddToRoleAsync(entity, role);
                            }
                            else
                            {
                                Console.WriteLine("Not Found Role {0}", role);
                            }
                        }
                    }

                }
                catch (Exception ex)
                {
                    Console.WriteLine("Error Json Parse Data {0}", ex.Message);
                }
            }
            else
            {
                Console.WriteLine("Not Found File Users.json");
            }
        }

        if(!context.Categories.Any())
        {
            var jsonFile = Path.Combine(Directory.GetCurrentDirectory(), "Helpers", "JsonData", "Categories.json");
            if (File.Exists(jsonFile))
            {
                var jsonData = await File.ReadAllTextAsync(jsonFile);
                try
                {
                    var categories = JsonSerializer.Deserialize<List<SeederCategoryDTO>>(jsonData);
                    if (categories == null) return;

                    IEnumerable<CategoryEntity> entities = [];

                    foreach (var category in categories)
                    {
                        var entity = mapper.Map<CategoryEntity>(category);

                        if (!string.IsNullOrWhiteSpace(category.image))
                        {
                            entity.ImageUrl = await imageService.SaveImageFromUrlAsync(
                                category.image,
                                Settings.CategoriesDir
                            );
                        }
                        else
                        {
                            entity.ImageUrl = null;
                        }

                        entities = entities.Append(entity);
                    }
                    await categoryRepository.CreateRangeAsync(entities);
                }
                catch (Exception ex)
                {
                    Console.WriteLine("Error Json Parse Data {0}", ex.Message);
                }
            }
            else
            {
                Console.WriteLine("Not Found File Categories.json");
            }
        }

        if (!context.Products.Any())
        {
            var jsonFile = Path.Combine(Directory.GetCurrentDirectory(), "Helpers", "JsonData", "Products.json");
            if (File.Exists(jsonFile))
            {
                var jsonData = await File.ReadAllTextAsync(jsonFile);
                try
                {
                    var products = JsonSerializer.Deserialize<List<SeederProductDTO>>(jsonData);
                    if (products == null) return;

                    foreach (var product in products)
                    {
                        var entity = mapper.Map<ProductEntity>(product);
                        if (product.Images != null)
                        {
                            foreach (var imageUrl in product.Images)
                            {
                                try
                                {
                                    string? imageName = await imageService.SaveImageFromUrlAsync(imageUrl, Settings.ProductsDir);

                                    entity.Images.Add(new ProductImageEntity
                                    {
                                        ImageUrl = imageName
                                    });
                                }
                                catch (HttpRequestException ex)
                                {
                                    Console.WriteLine($"Image not loaded: {imageUrl}");
                                    Console.WriteLine(ex.Message);
                                }
                            }
                        }
                        else
                        {
                            entity.Images = [];
                        }

                        var categories = categoryRepository
                            .GetAll()
                            .Where(c => product.Categories.Select(x => x.ToUpper()).Contains(c.Name.ToUpper()))
                            .ToList();

                        entity.Categories = categories;

                        await productRopository.CreateAsync(entity);
                    }
                }
                catch (Exception ex)
                {
                    Console.WriteLine("Error Json Parse Data {0}", ex.Message);
                }
            }
            else
            {
                Console.WriteLine("Not Found File Products.json");
            }
        }
    }
}
