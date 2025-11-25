using AutoMapper;
using Microsoft.EntityFrameworkCore;
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

            var result = await categoryRepository.CreateAsync(entity);

            if (result)
                return ServiceResponse.Success("Category created successfully");

            return ServiceResponse.Error("Failed to create category");
        }

        public async Task<ServiceResponse> DeleteAsync(long id)
        {
            var entity = await categoryRepository.GetByIdAsync(id);

            if (entity == null)
                return ServiceResponse.Error($"Category with Id {id} not found");

            if (entity.ImageUrl != null)
            {
                try
                {
                    await imageService.DeleteImageAsync(entity.ImageUrl, "categories");
                }
                catch (Exception ex)
                {
                    return ServiceResponse.Error($"Error deleting category image: {ex.Message}");
                }
            }

            var result = await categoryRepository.DeleteAsync(entity);

            if (result)
                return ServiceResponse.Success("Category deleted successfully");

            return ServiceResponse.Error("Failed to delete category");
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
                if (entity.ImageUrl != null)
                {
                    try
                    { 
                        await imageService.DeleteImageAsync(entity.ImageUrl, "categories");
                    }
                    catch (Exception ex)
                    {
                        return ServiceResponse.Error($"Error deleting old category image: {ex.Message}");
                    }
                }

                string? imageName = await imageService.SaveImageAsync(dto.Image, "categories");

                if (string.IsNullOrEmpty(imageName))
                    return ServiceResponse.Error("Failed to save new category image");

                entity.ImageUrl = imageName;
            }

            mapper.Map(dto, entity);

            var result = await categoryRepository.UpdateAsync(entity);

            if (result)
                return ServiceResponse.Success("Category updated successfully");

            return ServiceResponse.Error("Failed to update category");
        }
    }
}
