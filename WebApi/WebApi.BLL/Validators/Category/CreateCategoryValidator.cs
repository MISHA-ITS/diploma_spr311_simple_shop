using FluentValidation;
using WebApi.BLL.DTOs.Category;

namespace WebApi.BLL.Validators.Category
{
    public class CreateCategoryValidator : AbstractValidator<CreateCategoryDTO>
    {
        public CreateCategoryValidator()
        {
            RuleFor(x => x.Name).NotEmpty().WithMessage("Вкажіть назву категорії.")
                .MaximumLength(255).WithMessage("Назва категорії не повинно перевищувати 255 символів");

            RuleFor(x => x.Slug).NotEmpty().WithMessage("Поле не може бути пусте");
        }
    }
}
