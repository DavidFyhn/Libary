using api.Dtos;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace api.Services
{
    public interface IBookService
    {
        Task<IEnumerable<BookDto>> GetAllBooksAsync();
        Task<BookDto?> GetBookByIdAsync(string id);
        Task<BookDto> CreateBookAsync(BookDto bookDto);
        Task<bool> UpdateBookAsync(string id, BookDto bookDto);
        Task<bool> DeleteBookAsync(string id);
    }
}
