using AutoMapper;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using SixLabors.ImageSharp;
using WebApi.BLL.DTOs.Product;
using WebApi.BLL.Services.Image;
using WebApi.DAL.Entities;
using WebApi.DAL.Repositories.Category;
using WebApi.DAL.Repositories.Products;
    
namespace WebApi.BLL.Services.Product
{
    public class ProductService(
        IProductRepository productRepository, ICategoryRepository categoryRepository,
        IMapper mapper, IImageService imageService, ILogger<ProductService> logger) : IProductService
    {
        public async Task<ServiceResponse> CreateAsync(CreateProductDTO dto)
        {
            logger.LogInformation("Creating product with name {ProductName}", dto.Name);

            if (string.IsNullOrWhiteSpace(dto.Name))
            {
                logger.LogWarning("Product creation failed: Name is empty");
                return ServiceResponse.Error("Product name cannot be empty");
            }

            var entity = mapper.Map<ProductEntity>(dto);

            if (dto.Images != null)
            {
                foreach (var image in dto.Images)
                {
                    string? imageName = await imageService.SaveImageAsync(image, Settings.ProductsDir);
                    if (string.IsNullOrEmpty(imageName))
                    {
                        logger.LogError("Failed to save one of the images for product {ProductName}", dto.Name);
                        return ServiceResponse.Error("Failed to save one of the product images");
                    }

                    entity.Images.Add(new ProductImageEntity
                    {
                        ImageUrl = imageName
                    });
                    logger.LogInformation("Saved image {ImageName} for product {ProductName}", imageName, dto.Name);
                }
            }

            var categories = categoryRepository
                .GetAll()
                .Where(c => dto.Categories.Select(x => x.ToUpper()).Contains(c.Name.ToUpper()))
                .ToList();

            entity.Categories = categories;

            return await productRepository.CreateAsync(entity)
                ? ServiceResponse.Success("Product created successfully")
                : ServiceResponse.Error("Failed to create Product");
        }

        public async Task<ServiceResponse> DeleteAsync(long id)
        {
            logger.LogInformation("Deleting product with Id {ProductId}", id);

            var entity = await productRepository.GetByIdAsync(id);
            if (entity == null)
                return ServiceResponse.Error($"Product with Id {id} not found");

            foreach (var image in entity.Images)
            {
                var imageDeleteResult = await TryDeleteImageAsync(image.ImageUrl);
                if (imageDeleteResult != null)
                {
                    logger.LogError("Failed to delete image {ImageUrl} for product {ProductId}", image.ImageUrl, id);
                    return imageDeleteResult;
                }
            }

            return await productRepository.DeleteAsync(entity)
                ? ServiceResponse.Success("product deleted successfully")
                : ServiceResponse.Error("Failed to delete product");
        }

        public async Task<ServiceResponse> GetAllAsync(ProductFilterDto filter)
        {
            logger.LogDebug("Retrieving all products with filter {@Filter}", filter);

            var entities = productRepository.GetAll();
            entities = FilterProducts(entities, filter);

            var dtos = mapper.Map<List<ProductDTO>>(await entities.ToListAsync());

            logger.LogInformation("Retrieved {Count} products", dtos.Count);

            return ServiceResponse.Success("Products retrieved successfully", dtos);
        }

        public async Task<ServiceResponse> GetByIdAsync(long id)
        {
            logger.LogInformation("Retrieving product with Id {ProductId}", id);

            var entity = await productRepository.GetByIdAsync(id);

            if (entity == null)
                return ServiceResponse.Error($"Product with Id {id} not found");

            var dto = mapper.Map<ProductDTO>(entity);

            logger.LogInformation("Product with Id {ProductId} retrieved successfully", id);

            return ServiceResponse.Success("Product retrieved successfully", dto);
        }

        public async Task<ServiceResponse> UpdateAsync(UpdateProductDTO dto)
        {
            logger.LogInformation("Updating product with Id {ProductId}", dto.Id);

            var entity = await productRepository.GetByIdAsync(dto.Id);
            if (entity == null)
                return ServiceResponse.Error($"Product with Id {dto.Id} not found");

            if (dto.Images != null)
            {
                foreach (var image in entity.Images)
                {
                    var imageDeleteResult = await TryDeleteImageAsync(image.ImageUrl);
                    if (imageDeleteResult != null)
                    {
                        logger.LogError("Failed to delete image {ImageUrl} for product {ProductId}", image.ImageUrl, dto.Id);
                        return imageDeleteResult;
                    }
                }

                entity.Images = new List<ProductImageEntity>();

                foreach (var image in dto.Images)
                {
                    string? imageName = await imageService.SaveImageAsync(image, Settings.ProductsDir);

                    if (string.IsNullOrEmpty(imageName))
                    {
                        logger.LogError("Failed to save one of the images for product {ProductId}", dto.Id);
                        return ServiceResponse.Error("Failed to save one of the product images");
                    }

                    entity.Images.Add(new ProductImageEntity
                    {
                        ImageUrl = imageName,
                    });
                    logger.LogInformation("Saved image {ImageName} for product {ProductId}", imageName, dto.Id);
                }
            }

            mapper.Map(dto, entity);

            return await productRepository.UpdateAsync(entity)
                ? ServiceResponse.Success("Product updated successfully")
                : ServiceResponse.Error("Failed to update product");
        }

        private async Task<ServiceResponse?> TryDeleteImageAsync(string? url)
        {
            if (string.IsNullOrEmpty(url))
                return null;

            try
            {
                await imageService.DeleteImageAsync(url, Settings.ProductsDir);
                logger.LogInformation("Deleted product image {ImageUrl}", url);
                return null;
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Error deleting product image {ImageUrl}", url);
                return ServiceResponse.Error($"Error deleting product image: {ex.Message}");
            }
        }

        private IQueryable<ProductEntity> FilterProducts(IQueryable<ProductEntity> products, ProductFilterDto filter)
        {
            if (filter.categoryId.HasValue)
            {
                products = products
                    .Where(p => p.Categories.Any(c => c.Id == filter.categoryId.Value));
            }
            if (filter.minPrice.HasValue)
            {
                products = products
                    .Where(p => p.Price >= filter.minPrice.Value);
            }
            if (filter.maxPrice.HasValue)
            {
                products = products
                    .Where(p => p.Price <= filter.maxPrice.Value);
            }
            if (!string.IsNullOrEmpty(filter.sortBy))
            {
                bool ascending = filter.order?.ToLower() != "desc";
                products = filter.sortBy.ToLower() switch
                {
                    "price" => ascending
                        ? products.OrderBy(p => p.Price)
                        : products.OrderByDescending(p => p.Price),
                    "date" => ascending 
                        ? products.OrderBy(p => p.CreateDate)
                        : products.OrderByDescending(p => p.CreateDate),
                    _ => products
                };
            }
            return products;
        }
    }
}
