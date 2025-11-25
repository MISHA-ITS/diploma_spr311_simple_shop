using AutoMapper;
using Microsoft.EntityFrameworkCore;
using WebApi.BLL.Constatnts;
using WebApi.BLL.DTOs.Category;
using WebApi.BLL.Services.Image;
using WebApi.DAL.Entities;
using WebApi.DAL.Repositories.Category;

namespace WebApi.BLL.Services.Category
{
    public class CategoryService(ICategoryRepository categoryRepository,
        IMapper mapper, IImageService imageService) : ICategoryService
    {
        public async Task<ServiceResponse> CreateAsync(CreateCategoryDTO dto)
        {
            if(string.IsNullOrWhiteSpace(dto.Name))
                return ServiceResponse.Error("Category name cannot be empty");

            var entity = mapper.Map<CategoryEntity>(dto);

            if(dto.Image != null)
            {
                string? imageName = await imageService.SaveImageAsync(dto.Image, "categories");

                if (string.IsNullOrEmpty(imageName))
                    return ServiceResponse.Error("Failed to save category image");

                entity.ImageUrl = imageName;
            }

            return await categoryRepository.CreateAsync(entity)
                ? ServiceResponse.Success("Category created successfully")
                : ServiceResponse.Error("Failed to create category");
        }

        public async Task<ServiceResponse> DeleteAsync(long id)
        {
            var entity = await categoryRepository.GetByIdAsync(id);

            if (entity == null)
                return ServiceResponse.Error($"Category with Id {id} not found");

            var imageDeleteResult = await TryDeleteImageAsync(entity.ImageUrl);
            if (imageDeleteResult != null)
                return imageDeleteResult;

            return await categoryRepository.DeleteAsync(entity)
                ? ServiceResponse.Success("Category deleted successfully")
                : ServiceResponse.Error("Failed to delete category");
        }

        public async Task<ServiceResponse> GetAllAsync()
        {
            var entities = categoryRepository.GetAll();

            var dtos = mapper.Map<List<CategoryDTO>>(await entities.ToListAsync());

            return ServiceResponse.Success("Categories retrieved successfully", dtos);
        }

        public async Task<ServiceResponse> GetByIdAsync(long id)
        {
            var entity = await categoryRepository.GetByIdAsync(id);

            if (entity == null)
                return ServiceResponse.Error($"Category with Id {id} not found");

            var dto = mapper.Map<CategoryDTO>(entity);

            return ServiceResponse.Success("Category retrieved successfully", dto);
        }

        public async Task<ServiceResponse> UpdateAsync(UpdateCategoryDTO dto)
        {
            var entity = await categoryRepository.GetByIdAsync(dto.Id);

            if (entity == null)
                return ServiceResponse.Error($"Category with Id {dto.Id} not found");

            if (dto.Image != null)
            {
                var imageDeleteResult = await TryDeleteImageAsync(entity.ImageUrl);
                if (imageDeleteResult != null)
                    return imageDeleteResult;

                string? imageName = await imageService.SaveImageAsync(dto.Image, PathSetting.CategoriesFolder);

                if (string.IsNullOrEmpty(imageName))
                    return ServiceResponse.Error("Failed to save new category image");

                entity.ImageUrl = imageName;
            }

            mapper.Map(dto, entity);

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
                await imageService.DeleteImageAsync(url, PathSetting.CategoriesFolder);
                return null;
            }
            catch (Exception ex)
            {
                return ServiceResponse.Error($"Error deleting category image: {ex.Message}");
            }
        }
    }
}
