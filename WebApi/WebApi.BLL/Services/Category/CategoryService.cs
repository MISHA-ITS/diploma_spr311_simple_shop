using AutoMapper;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using WebApi.BLL.DTOs;
using WebApi.BLL.DTOs.Category;
using WebApi.BLL.Extensions;
using WebApi.BLL.Services.Image;
using WebApi.DAL.Entities;
using WebApi.DAL.Repositories.Category;

namespace WebApi.BLL.Services.Category
{
    public class CategoryService(ICategoryRepository categoryRepository,
        IMapper mapper, IImageService imageService, ILogger<CategoryService> logger) : ICategoryService
    {
        public async Task<ServiceResponse> CreateAsync(CreateCategoryDTO dto)
        {

            logger.LogInformation("Creating category with name: {CategoryName}", dto.Name);

            if (string.IsNullOrWhiteSpace(dto.Name))
            {
                logger.LogWarning("Failed to create category: Category name is empty");
                return ServiceResponse.Error("Category name cannot be empty");
            }

            var entity = mapper.Map<CategoryEntity>(dto);

            entity.Slug = entity.Name.ToSlug();

            if(dto.Image != null)
            {
                try
                {
                    string? imageName = await imageService.SaveImageAsync(dto.Image, Settings.ImagesPath);

                    if (string.IsNullOrEmpty(imageName))
                    {
                        logger.LogError("Failed to save category image for {CategoryName}", dto.Name);
                        return ServiceResponse.Error("Failed to save category image");
                    }

                    entity.ImageUrl = imageName;
                    logger.LogInformation("Saved image {ImageName} for category {CategoryName}", imageName, dto.Name);
                }
                catch (Exception ex)
                {
                    logger.LogError(ex, "Exception occurred while saving image for category {CategoryName}", dto.Name);
                    return ServiceResponse.Error("An error occurred while saving the category image");
                }

            }

            return await categoryRepository.CreateAsync(entity) 
                ? ServiceResponse.Success("Category created successfully")
                : ServiceResponse.Error("Failed to create category");
        }

        public async Task<ServiceResponse> DeleteAsync(long id)
        {
            logger.LogInformation("Attempting to delete category with Id {CategoryId}", id);

            var entity = await categoryRepository.GetByIdAsync(id);
            if (entity == null)
            {
                logger.LogWarning("Category with Id {CategoryId} not found", id);
                return ServiceResponse.Error($"Category with Id {id} not found");
            }    

            var imageDeleteResult = await TryDeleteImageAsync(entity.ImageUrl);
            if (imageDeleteResult != null)
            {
                logger.LogError("Failed to delete image for category {CategoryId}", id);
                return imageDeleteResult;
            }

            return await categoryRepository.DeleteAsync(entity)
                ? ServiceResponse.Success("Category deleted successfully")
                : ServiceResponse.Error("Failed to delete category");
        }

        public async Task<ServiceResponse> GetAllAsync()
        {
            logger.LogDebug("Retrieving all categories");

            //var entities = categoryRepository.GetAll();
            //var dtos = mapper.Map<List<CategoryDTO>>(await entities.ToListAsync());

            var dtos = await mapper.ProjectTo<CategoryDTO>(categoryRepository.GetAll()).OrderBy(x => x.Id).ToListAsync();

            logger.LogInformation("Retrieved {Count} categories", dtos.Count);

            return ServiceResponse.Success("Categories retrieved successfully", dtos);
        }

        public async Task<ServiceResponse> GetByIdAsync(long id)
        {
            logger.LogInformation("Retrieving category with Id {CategoryId}", id);

            var entity = await categoryRepository.GetByIdAsync(id);
            if (entity == null)
                return ServiceResponse.Error($"Category with Id {id} not found");

            var dto = mapper.Map<CategoryDTO>(entity);

            logger.LogInformation("Category with Id {CategoryId} retrieved successfully", id);

            return ServiceResponse.Success("Category retrieved successfully", dto);
        }

        public async Task<ServiceResponse> UpdateAsync(UpdateCategoryDTO dto)
        {
            logger.LogInformation("Updating category with Id {CategoryId}", dto.Id);

            var entity = await categoryRepository.GetByIdAsync(dto.Id);
            if (entity == null)
                return ServiceResponse.Error($"Category with Id {dto.Id} not found");

            entity.ParentId = dto.ParentId;
            if (entity.Name != dto.Name)
            {
                entity.Name = dto.Name;
                entity.Slug = dto.Name.ToSlug();
            }

            if (dto.Image != null)
            {
                var imageDeleteResult = await TryDeleteImageAsync(entity.ImageUrl);
                if (imageDeleteResult != null)
                {
                    logger.LogError("Failed to delete old image for category {CategoryId}", dto.Id);
                    return imageDeleteResult;
                }

                string? imageName = await imageService.SaveImageAsync(dto.Image, Settings.ImagesPath);

                if (string.IsNullOrEmpty(imageName))
                {
                    logger.LogError("Failed to save new image for category {CategoryId}", dto.Id);
                    return ServiceResponse.Error("Failed to save new category image");
                }

                entity.ImageUrl = imageName;
                logger.LogInformation("Updated image for category {CategoryId} to {ImageName}", dto.Id, imageName);
            }

            mapper.Map(dto, entity);

            logger.LogInformation(
    "DTO: Id={Id}, Name={Name}, ParentId={ParentId}, HasImage={HasImage}",
    dto.Id,
    dto.Name,
    dto.ParentId,
    dto.Image != null
);

            return await categoryRepository.UpdateAsync(entity)
                ?  ServiceResponse.Success("Category updated successfully")
                :  ServiceResponse.Error("Failed to update category");
        }

        private async Task<ServiceResponse?> TryDeleteImageAsync(string? url)
        {
            if (string.IsNullOrEmpty(url))
                return null;

            try
            {
                await imageService.DeleteImageAsync(url, "");
                logger.LogInformation("Deleted image {ImageUrl}", url);
                return null;
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Error deleting category image {ImageUrl}", url);
                return ServiceResponse.Error($"Error deleting category image: {ex.Message}");
            }
        }

        public async Task<ServiceResponse> GetPageAsync(int page, int size, string? searchName, string? parentName)
        {
            var query = mapper.ProjectTo<CategoryDTO>(
                categoryRepository.GetAll().OrderBy(x => x.Id).AsNoTracking()
            );

            if (!string.IsNullOrWhiteSpace(searchName))
            {
                query = query.Where(x =>
                    x.Name.ToLower().Contains(searchName.ToLower())
                );
            }

            if (!string.IsNullOrWhiteSpace(parentName))
            {
                query = query.Where(x =>
                    x.ParentName != null &&
                    x.ParentName.ToLower().Contains(parentName.ToLower())
                );
            }

            var total = await query.CountAsync();

            var items = await query
                .Skip((page - 1) * size)
                .Take(size)
                .ToListAsync();

            var result = new PageResponseDTO<CategoryDTO>
            {
                Total = total,
                Items = items
            };

            logger.LogInformation("Categories page received. Size={Size}, Total={Total}, searchName={searchName}, parentName={parentName}", size, total, searchName, parentName);

            return ServiceResponse.Success(
                "Categories retrieved successfully",
                result
            );
        }
    }
}
