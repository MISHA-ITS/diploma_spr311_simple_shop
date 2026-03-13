using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using WebApi.BLL.DTOs.Advertisement;
using WebApi.BLL.Services.Image;
using WebApi.BLL.Services.NewPost;
using WebApi.DAL.Entities;
using WebApi.DAL.Repositories.Advertisements;
using WebApi.DAL.Repositories.Category;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory;

namespace WebApi.BLL.Services.Advertisement
{
    public class AdvertisementService(
        IAdvertisementRepository advertisementRepository, IMapper mapper, IImageService imageService, 
        ILogger<AdvertisementService> logger, INewPostService newPostService, ICategoryRepository categoryRepository) : IAdvertisementService
    {

        public async Task<ServiceResponse> CreateAsync(CreateAdvertisementDTO dto, long userId)
        {
            logger.LogInformation("Creating advertisement with name {advertisementName}", dto.Name);

            if (string.IsNullOrWhiteSpace(dto.Name))
            {
                logger.LogWarning("advertisement creation failed: Name is empty");
                return ServiceResponse.Error("advertisement name cannot be empty");
            }

            var entity = mapper.Map<AdvertisementEntity>(dto);

            entity.UserId = userId;

            if (dto.Images != null)
            {
                for (int i = 0; i < dto.Images.Count; i++)
                {
                    var image = dto.Images[i];
                    string? imageName = await imageService.SaveImageAsync(image, Settings.AdvertisementsDir);

                    if (string.IsNullOrEmpty(imageName))
                    {
                        logger.LogError("Failed to save one of the images for advertisement {advertisementName}", dto.Name);
                        return ServiceResponse.Error("Failed to save one of the advertisement images");
                    }

                    entity.Images.Add(new AdvertisementImageEntity
                    {
                        ImageUrl = imageName,
                        // ПЕРЕВІРКА: якщо i збігається з вибраним індексом з фронтенду
                        // Якщо з фронта нічого не прийшло (0), то перше фото за замовчуванням стане головним
                        IsMain = (i == dto.MainImageIndex)
                    });

                    logger.LogInformation("Saved image {ImageName} (Main: {IsMain}) for advertisement {advertisementName}",
                        imageName, i == dto.MainImageIndex, dto.Name);
                }
            }

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

            var (pagedEntities, totalCount) = await FilterAdvertisementsPagedAsync(entities, filter);

            var dtos = mapper.Map<List<AdvertisementDTO>>(pagedEntities);

            foreach (var dto in dtos)
            {
                var entity = pagedEntities.First(e => e.Id == dto.Id);

                if (dto.Images != null && dto.Images.Any())
                {
                    dto.Images = dto.Images
                        .OrderByDescending(img => img.IsMain)
                        .ToList();
                }

                if (!string.IsNullOrEmpty(entity.SettlementRef))
                {
                    dto.Settlement = await newPostService.GetSettlement(entity.SettlementRef);
                }
            }

            var pagedResponse = new PagedResponse<AdvertisementDTO>
            {
                Items = dtos,
                TotalCount = totalCount,
                PageNumber = filter.pageNumber,
                PageSize = filter.pageSize
            };

            logger.LogInformation("Retrieved {Count} advertisements", dtos.Count);

            return ServiceResponse.Success("advertisements retrieved successfully", pagedResponse);
        }

        public async Task<ServiceResponse> GetByIdAsync(long id)
        {
            logger.LogInformation("Retrieving advertisement with Id {advertisementId}", id);

            var entity = await advertisementRepository.GetByIdAsync(id);

            if (entity == null)
                return ServiceResponse.Error($"advertisement with Id {id} not found");

            entity.Images = entity.Images.OrderByDescending(img => img.IsMain).ToList();
            var dto = mapper.Map<AdvertisementDTO>(entity);

            dto.Settlement = entity.SettlementRef != null
                ? await newPostService.GetSettlement(entity.SettlementRef)
                : null;

            logger.LogInformation("advertisement with Id {advertisementId} retrieved successfully", id);

            return ServiceResponse.Success("advertisement retrieved successfully", dto);
        }

        public async Task<ServiceResponse> GetByUserIdAsync(long userId)
        {
            var entity = await advertisementRepository
                .GetAll()
                .Where(a => a.UserId == userId)
                .ProjectTo<AdvertisementDTO>(mapper.ConfigurationProvider)
                .ToListAsync();

            return ServiceResponse.Success("advertisement retrieved successfully", entity);
        }

        public async Task<ServiceResponse> UpdateAsync(UpdateAdvertisementDTO dto, long userId)
        {
            logger.LogInformation("Updating advertisement with Id {advertisementId}", dto.Id);

            var entity = await advertisementRepository.GetByIdAsync(dto.Id);
            if (entity == null)
                return ServiceResponse.Error($"advertisement with Id {dto.Id} not found");

            if (entity.UserId != userId)
            {
                logger.LogWarning("User {userId} tried to edit advertisement {adId} owned by {ownerId}", userId, dto.Id, entity.UserId);
                return ServiceResponse.Error("You don't have permission to edit this advertisement");
            }

            var imagesToDelete = entity.Images
                .Where(img => dto.ExistingImages == null || !dto.ExistingImages.Contains(img.ImageUrl))
                .ToList();

            foreach (var image in imagesToDelete)
            {
                await imageService.DeleteImageAsync(image.ImageUrl, Settings.AdvertisementsDir);
                entity.Images.Remove(image);
            }

            if (dto.Images != null)
            {
                foreach (var file in dto.Images)
                {
                    string imageName = await imageService.SaveImageAsync(file, Settings.AdvertisementsDir);
                    if (!string.IsNullOrEmpty(imageName))
                    {
                        entity.Images.Add(new AdvertisementImageEntity
                        {
                            ImageUrl = imageName,
                            IsMain = false // Тимчасово false, оновимо нижче за індексом
                        });
                    }
                }
            }

            for (int i = 0; i < entity.Images.Count; i++)
            {
                entity.Images.ElementAt(i).IsMain = (i == dto.MainImageIndex);
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

        private async Task<(List<AdvertisementEntity> pagedAds, int totalCount)> FilterAdvertisementsPagedAsync(
            IQueryable<AdvertisementEntity> advertisements, 
            AdvertisementFilterDto filter)
        {
            if (filter.categoryId.HasValue)
            {
                var categoryIds = await categoryRepository.GetAllChildCategoryIdsAsync(filter.categoryId.Value);
                advertisements = advertisements.Where(a => categoryIds.Contains(a.CategoryId));
            }
            if (filter.active.HasValue)
            {
                advertisements = advertisements.Where(a => a.isActive == filter.active.Value);
            }
            if (filter.minPrice.HasValue)
            {
                advertisements = advertisements
                    .Where(p => p.Price >= filter.minPrice.Value);
            }
            if (!string.IsNullOrEmpty(filter.settlementRef))
            {
                advertisements = advertisements
                    .Where(a => a.SettlementRef == filter.settlementRef);
            }
            if (!string.IsNullOrEmpty(filter.date))
            {
                DateTime fromDate = DateTime.UtcNow;
                
                switch (filter.date.ToLower())
                {
                    case "today":
                        fromDate = DateTime.UtcNow.Date;
                        break;

                    case "week":
                        fromDate = DateTime.UtcNow.AddDays(-7);
                        break;

                    case "month":
                        fromDate = DateTime.UtcNow.AddMonths(-1);
                        break;
                }

                advertisements = advertisements.Where(a => a.UpdateDate >= fromDate);
            }
            if (!string.IsNullOrWhiteSpace(filter.search))
            {
                string search = filter.search.ToLower();

                advertisements = advertisements.Where(a =>
                    a.Name.ToLower().Contains(search) ||
                    (a.Description != null && a.Description.ToLower().Contains(search))
                );
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
                        ? advertisements.OrderBy(p => p.UpdateDate)
                        : advertisements.OrderByDescending(p => p.UpdateDate),
                    _ => advertisements
                };
            }
            else
            {
                advertisements = advertisements.OrderBy(p => p.Id);
            }

            var totalCount = await advertisements.CountAsync();

            int pageNumber = filter.pageNumber <= 0 ? 1 : filter.pageNumber;
            int skip = (pageNumber - 1) * filter.pageSize;

            var pagedList = await advertisements.Skip(skip).Take(filter.pageSize).ToListAsync();

            return (pagedList, totalCount);
        }
        public async Task<ServiceResponse> ToggleBlockAsync(long id)
        {
            var ad = await advertisementRepository.GetByIdAsync(id);
            if (ad == null) return ServiceResponse.Error("Оголошення не знайдено");

            // Просто інвертуємо поточний стан
            ad.isBlocked = !ad.isBlocked;

            // Якщо ми блокуємо, можливо, варто автоматично знімати IsActive
            if (ad.isBlocked) ad.isActive = false;

            await advertisementRepository.UpdateAsync(ad);
            return ServiceResponse.Success(ad.isBlocked ? "Заблоковано" : "Розблоковано");
        }

        public async Task<ServiceResponse> ApproveAsync(long id)
        {
            var ad = await advertisementRepository.GetByIdAsync(id);
            if (ad == null) return ServiceResponse.Error("Оголошення не знайдено");

            ad.isApproved = true;
            ad.isActive = true;

            await advertisementRepository.UpdateAsync(ad);
            return ServiceResponse.Success("Підтверджено");
        }
    }
}
