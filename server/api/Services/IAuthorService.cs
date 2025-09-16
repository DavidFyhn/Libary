using api.Dtos;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace api.Services
{
    public interface IAuthorService
    {
        Task<IEnumerable<AuthorDto>> GetAllAuthorsAsync();
        Task<AuthorDto?> GetAuthorByIdAsync(string id);
        Task<AuthorDto> CreateAuthorAsync(AuthorDto authorDto);
        Task<bool> UpdateAuthorAsync(string id, AuthorDto authorDto);
        Task<bool> DeleteAuthorAsync(string id);
    }
}
