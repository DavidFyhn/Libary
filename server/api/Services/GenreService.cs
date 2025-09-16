using api.Dtos;
using DataAccess.Data;
using DataAccess.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace api.Services
{
    public class GenreService : IGenreService
    {
        private readonly NeondbContext _context;

        public GenreService(NeondbContext context)
        {
            _context = context;
        }

        public async Task<GenreDto> CreateGenreAsync(GenreDto genreDto)
        {
            var genre = new Genre
            {
                Id = Guid.NewGuid().ToString(),
                Name = genreDto.Name,
                Createdat = DateTime.UtcNow
            };

            _context.Genres.Add(genre);
            await _context.SaveChangesAsync();

            genreDto.Id = genre.Id;
            return genreDto;
        }

        public async Task<bool> DeleteGenreAsync(string id)
        {
            var genre = await _context.Genres.FindAsync(id);
            if (genre == null)
            {
                return false;
            }

            _context.Genres.Remove(genre);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<IEnumerable<GenreDto>> GetAllGenresAsync()
        {
            var genres = await _context.Genres
                .Include(g => g.Books)
                .Select(g => new GenreDto
                {
                    Id = g.Id,
                    Name = g.Name,
                    BookIds = g.Books.Select(b => b.Id).ToList()
                })
                .ToListAsync();

            return genres;
        }

        public async Task<GenreDto?> GetGenreByIdAsync(string id)
        {
            var genre = await _context.Genres
                .Include(g => g.Books)
                .Where(g => g.Id == id)
                .Select(g => new GenreDto
                {
                    Id = g.Id,
                    Name = g.Name,
                    BookIds = g.Books.Select(b => b.Id).ToList()
                })
                .FirstOrDefaultAsync();

            return genre;
        }

        public async Task<bool> UpdateGenreAsync(string id, GenreDto genreDto)
        {
            var genre = await _context.Genres.FindAsync(id);

            if (genre == null)
            {
                return false;
            }

            genre.Name = genreDto.Name;

            await _context.SaveChangesAsync();
            return true;
        }
    }
}
