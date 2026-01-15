using FluentValidation;
using WebApi.BLL.DTOs.Category;

namespace WebApi.BLL.Validators.Category
{
    public class UpdateCategoryValidator : AbstractValidator<UpdateCategoryDTO>
    {
        public UpdateCategoryValidator()
        {
            RuleFor(x => x.Id).NotEmpty().WithMessage("Id обов'язковий для оновлення");

            RuleFor(x => x.Name).NotEmpty().WithMessage("Вкажіть назву категорії.")
                .MaximumLength(255).WithMessage("Назва категорії не повинно перевищувати 255 символів");
        }
    }
}
