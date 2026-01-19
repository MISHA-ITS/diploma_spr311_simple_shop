using AutoMapper;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using SixLabors.ImageSharp;
using WebApi.BLL.DTOs.Advertisement;
using WebApi.BLL.Services.Image;
using WebApi.DAL.Entities;
using WebApi.DAL.Repositories.Category;
using WebApi.DAL.Repositories.Advertisements;

namespace WebApi.BLL.Services.Advertisement
{
    public class AdvertisementService(
        IAdvertisementRepository advertisementRepository, ICategoryRepository categoryRepository,
        IMapper mapper, IImageService imageService, ILogger<AdvertisementService> logger) : IAdvertisementService
    {
        public async Task<ServiceResponse> CreateAsync(CreateAdvertisementDTO dto)
        {
            logger.LogInformation("Creating advertisement with name {advertisementName}", dto.Name);

            if (string.IsNullOrWhiteSpace(dto.Name))
            {
                logger.LogWarning("advertisement creation failed: Name is empty");
                return ServiceResponse.Error("advertisement name cannot be empty");
            }

            var entity = mapper.Map<AdvertisementEntity>(dto);

            if (dto.Images != null)
            {
                foreach (var image in dto.Images)
                {
                    string? imageName = await imageService.SaveImageAsync(image, Settings.AdvertisementsDir);
                    if (string.IsNullOrEmpty(imageName))
                    {
                        logger.LogError("Failed to save one of the images for advertisement {advertisementName}", dto.Name);
                        return ServiceResponse.Error("Failed to save one of the advertisement images");
                    }

                    entity.Images.Add(new AdvertisementImageEntity
                    {
                        ImageUrl = imageName
                    });
                    logger.LogInformation("Saved image {ImageName} for advertisement {advertisementName}", imageName, dto.Name);
                }
            }

            var categories = categoryRepository
                .GetAll()
                .Where(c => dto.Categories.Select(x => x.ToUpper()).Contains(c.Name.ToUpper()))
                .ToList();

            entity.Categories = categories;

            return await advertisementRepository.CreateAsync(entity)
                ? ServiceResponse.Success("advertisement created successfully")
                : ServiceResponse.Error("Failed to create advertisement");
        }

        public async Task<ServiceResponse> DeleteAsync(long id)
        {
            logger.LogInformation("Deleting advertisement with Id {advertisementId}", id);

            var entity = await advertisementRepository.GetByIdAsync(id);
            if (entity == null)
                return ServiceResponse.Error($"advertisement with Id {id} not found");

            foreach (var image in entity.Images)
            {
                var imageDeleteResult = await TryDeleteImageAsync(image.ImageUrl);
                if (imageDeleteResult != null)
                {
                    logger.LogError("Failed to delete image {ImageUrl} for advertisement {advertisementId}", image.ImageUrl, id);
                    return imageDeleteResult;
                }
            }

            return await advertisementRepository.DeleteAsync(entity)
                ? ServiceResponse.Success("advertisement deleted successfully")
                : ServiceResponse.Error("Failed to delete advertisement");
        }

        public async Task<ServiceResponse> GetAllAsync(AdvertisementFilterDto filter)
        {
            logger.LogDebug("Retrieving all advertisements with filter {@Filter}", filter);

            var entities = advertisementRepository.GetAll();
            entities = Filteradvertisements(entities, filter);

            var dtos = mapper.Map<List<AdvertisementFilterDto>>(await entities.ToListAsync());

            logger.LogInformation("Retrieved {Count} advertisements", dtos.Count);

            return ServiceResponse.Success("advertisements retrieved successfully", dtos);
        }

        public async Task<ServiceResponse> GetByIdAsync(long id)
        {
            logger.LogInformation("Retrieving advertisement with Id {advertisementId}", id);

            var entity = await advertisementRepository.GetByIdAsync(id);

            if (entity == null)
                return ServiceResponse.Error($"advertisement with Id {id} not found");

            var dto = mapper.Map<AdvertisementDTO>(entity);

            logger.LogInformation("advertisement with Id {advertisementId} retrieved successfully", id);

            return ServiceResponse.Success("advertisement retrieved successfully", dto);
        }

        public async Task<ServiceResponse> UpdateAsync(UpdateAdvertisementDTO dto)
        {
            logger.LogInformation("Updating advertisement with Id {advertisementId}", dto.Id);

            var entity = await advertisementRepository.GetByIdAsync(dto.Id);
            if (entity == null)
                return ServiceResponse.Error($"advertisement with Id {dto.Id} not found");

            if (dto.Images != null)
            {
                foreach (var image in entity.Images)
                {
                    var imageDeleteResult = await TryDeleteImageAsync(image.ImageUrl);
                    if (imageDeleteResult != null)
                    {
                        logger.LogError("Failed to delete image {ImageUrl} for advertisement {advertisementId}", image.ImageUrl, dto.Id);
                        return imageDeleteResult;
                    }
                }

                entity.Images = new List<AdvertisementImageEntity>();

                foreach (var image in dto.Images)
                {
                    string? imageName = await imageService.SaveImageAsync(image, Settings.AdvertisementsDir);

                    if (string.IsNullOrEmpty(imageName))
                    {
                        logger.LogError("Failed to save one of the images for advertisement {advertisementId}", dto.Id);
                        return ServiceResponse.Error("Failed to save one of the advertisement images");
                    }

                    entity.Images.Add(new AdvertisementImageEntity
                    {
                        ImageUrl = imageName,
                    });
                    logger.LogInformation("Saved image {ImageName} for advertisement {advertisementId}", imageName, dto.Id);
                }
            }

            mapper.Map(dto, entity);

            return await advertisementRepository.UpdateAsync(entity)
                ? ServiceResponse.Success("advertisement updated successfully")
                : ServiceResponse.Error("Failed to update advertisement");
        }

        private async Task<ServiceResponse?> TryDeleteImageAsync(string? url)
        {
            if (string.IsNullOrEmpty(url))
                return null;

            try
            {
                await imageService.DeleteImageAsync(url, Settings.AdvertisementsDir);
                logger.LogInformation("Deleted advertisement image {ImageUrl}", url);
                return null;
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Error deleting advertisement image {ImageUrl}", url);
                return ServiceResponse.Error($"Error deleting advertisement image: {ex.Message}");
            }
        }

        private IQueryable<AdvertisementEntity> Filteradvertisements(IQueryable<AdvertisementEntity> advertisements, AdvertisementFilterDto filter)
        {
            if (filter.categoryId.HasValue)
            {
                advertisements = advertisements
                    .Where(p => p.Categories.Any(c => c.Id == filter.categoryId.Value));
            }
            if (filter.minPrice.HasValue)
            {
                advertisements = advertisements
                    .Where(p => p.Price >= filter.minPrice.Value);
            }
            if (filter.maxPrice.HasValue)
            {
                advertisements = advertisements
                    .Where(p => p.Price <= filter.maxPrice.Value);
            }
            if (!string.IsNullOrEmpty(filter.sortBy))
            {
                bool ascending = filter.order?.ToLower() != "desc";
                advertisements = filter.sortBy.ToLower() switch
                {
                    "price" => ascending
                        ? advertisements.OrderBy(p => p.Price)
                        : advertisements.OrderByDescending(p => p.Price),
                    "date" => ascending 
                        ? advertisements.OrderBy(p => p.CreateDate)
                        : advertisements.OrderByDescending(p => p.CreateDate),
                    _ => advertisements
                };
            }
            else
            {
                advertisements = advertisements.OrderBy(p => p.Id);
            }

            int pageSize = 4;
            int pageNumber = filter.pageNumber <= 0 ? 1 : filter.pageNumber;

            int skip = (pageNumber - 1) * pageSize;

            advertisements = advertisements.Skip(skip).Take(pageSize);

            return advertisements;
        }
    }
}
