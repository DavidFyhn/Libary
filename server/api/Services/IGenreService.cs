using api.Dtos;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace api.Services
{
    public interface IGenreService
    {
        Task<IEnumerable<GenreDto>> GetAllGenresAsync();
        Task<GenreDto?> GetGenreByIdAsync(string id);
        Task<GenreDto> CreateGenreAsync(GenreDto genreDto);
        Task<bool> UpdateGenreAsync(string id, GenreDto genreDto);
        Task<bool> DeleteGenreAsync(string id);
    }
}
