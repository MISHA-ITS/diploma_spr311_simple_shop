using AutoMapper;
using Microsoft.EntityFrameworkCore;
using SixLabors.ImageSharp;
using WebApi.BLL.DTOs.Category;
using WebApi.BLL.DTOs.Product;
using WebApi.BLL.Services.Image;
using WebApi.DAL.Entities;
using WebApi.DAL.Repositories.Category;
using WebApi.DAL.Repositories.Products;

namespace WebApi.BLL.Services.Product
{
    public class ProductService(
        IProductRepository productRepository, ICategoryRepository categoryRepository,
        IMapper mapper,IImageService imageService) : IProductService
    {
        public async Task<ServiceResponse> CreateAsync(CreateProductDTO dto)
        {
            if (string.IsNullOrWhiteSpace(dto.Name))
                return ServiceResponse.Error("Product name cannot be empty");

            var entity = mapper.Map<ProductEntity>(dto);

            if (dto.Images != null)
            {
                entity.Images = new List<ProductImageEntity>();

                foreach (var image in dto.Images)
                {
                    string? imageName = await imageService.SaveImageAsync(image, Settings.ProductsDir);

                    if (string.IsNullOrEmpty(imageName))
                        return ServiceResponse.Error("Failed to save one of the product images");

                    entity.Images.Add(new ProductImageEntity
                    {
                        Name = imageName
                    });
                }
            }

            var categories = categoryRepository
                .GetAll()
                .Where(c => dto.Categories.Select(x => x.ToUpper()).Contains(c.Name.ToUpper()))
                .ToList();

            return await productRepository.CreateAsync(entity)
                ? ServiceResponse.Success("Product created successfully")
                : ServiceResponse.Error("Failed to create Product");
        }

        public async Task<ServiceResponse> DeleteAsync(long id)
        {
            var entity = await productRepository.GetByIdAsync(id);

            if (entity == null)
                return ServiceResponse.Error($"Product with Id {id} not found");

            var imageDeleteResult = await TryDeleteImageAsync(entity.Name);
            if (imageDeleteResult != null)
                return imageDeleteResult;

            return await productRepository.DeleteAsync(entity)
                ? ServiceResponse.Success("product deleted successfully")
                : ServiceResponse.Error("Failed to delete product");
        }

        public async Task<ServiceResponse> GetAllAsync()
        {
            var entities = productRepository.GetAll();

            var dtos = mapper.Map<List<ProductDTO>>(await entities.ToListAsync());

            return ServiceResponse.Success("Products retrieved successfully", dtos);
        }

        public async Task<ServiceResponse> GetByIdAsync(long id)
        {
            var entity = await productRepository.GetByIdAsync(id);

            if (entity == null)
                return ServiceResponse.Error($"Product with Id {id} not found");

            var dto = mapper.Map<ProductDTO>(entity);

            return ServiceResponse.Success("Product retrieved successfully", dto);
        }

        public async Task<ServiceResponse> UpdateAsync(UpdateProductDTO dto)
        {
            var entity = await productRepository.GetByIdAsync(dto.Id);

            if (entity == null)
                return ServiceResponse.Error($"Product with Id {dto.Id} not found");

            if (dto.Images != null)
            {
                foreach (var image in entity.Images)
                {
                    var imageDeleteResult = await TryDeleteImageAsync(entity.Name);
                    if (imageDeleteResult != null)
                        return imageDeleteResult;
                }

                entity.Images = new List<ProductImageEntity>();

                foreach (var image in dto.Images)
                {
                    string? imageName = await imageService.SaveImageAsync(image, Settings.ProductsDir);

                    if (string.IsNullOrEmpty(imageName))
                        return ServiceResponse.Error("Failed to save one of the product images");

                    entity.Images.Add(new ProductImageEntity
                    {
                        Name = imageName
                    });
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
                return null;
            }
            catch (Exception ex)
            {
                return ServiceResponse.Error($"Error deleting product image: {ex.Message}");
            }
        }
    }
}
