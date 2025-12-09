using FluentValidation;
using WebApi.BLL.DTOs.Role;

namespace WebApi.BLL.Validators.Role;

public class UpdateRoleValidator : AbstractValidator<UpdateRoleDto>
{
    public UpdateRoleValidator()
    {
        RuleFor(x => x.Id)
            .NotEmpty().WithMessage("Id обов'язковий для оновлення");

        RuleFor(x => x.Name)
            .NotEmpty().WithMessage("Назва ролі обов'язкова")
            .MinimumLength(4).WithMessage("Назва ролі повинна містити не менше 4 символів")
            .MaximumLength(50).WithMessage("Назва ролі не повинна перевищувати 50 символів");
    }
}
