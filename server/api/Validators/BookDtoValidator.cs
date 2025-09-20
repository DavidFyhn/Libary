using api.Dtos;
using FluentValidation;

namespace api.Validators;

public class BookDtoValidator : AbstractValidator<BookDto>
{
    public BookDtoValidator()
    {
        RuleFor(x => x.Title).NotEmpty().WithMessage("Title is required.");
        RuleFor(x => x.Pages).GreaterThan(0).WithMessage("Number of pages must be greater than 0.");
    }
}
