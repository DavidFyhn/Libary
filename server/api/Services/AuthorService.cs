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
    public class AuthorService : IAuthorService
    {
        private readonly NeondbContext _context;

        public AuthorService(NeondbContext context)
        {
            _context = context;
        }

        public async Task<AuthorDto> CreateAuthorAsync(AuthorDto authorDto)
        {
            var author = new Author
            {
                Id = Guid.NewGuid().ToString(),
                Name = authorDto.Name,
                Createdat = DateTime.UtcNow
            };

            if (authorDto.BookIds != null && authorDto.BookIds.Any())
            {
                var books = await _context.Books
                    .Where(b => authorDto.BookIds.Contains(b.Id))
                    .ToListAsync();
                author.Books = books;
            }

            _context.Authors.Add(author);
            await _context.SaveChangesAsync();

            // THE DEFINITIVE FIX
            return new AuthorDto
            {
                Id = author.Id,
                Name = author.Name,
                BookIds = authorDto.BookIds ?? new List<string>() // Use the original DTO's list safely
            };
        }

        public async Task<bool> DeleteAuthorAsync(string id)
        {
            var author = await _context.Authors.FindAsync(id);
            if (author == null)
            {
                return false;
            }

            _context.Authors.Remove(author);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<IEnumerable<AuthorDto>> GetAllAuthorsAsync()
        {
            var authors = await _context.Authors
                .Include(a => a.Books)
                .Select(a => new AuthorDto
                {
                    Id = a.Id,
                    Name = a.Name,
                    BookIds = a.Books.Select(b => b.Id).ToList()
                })
                .ToListAsync();

            return authors;
        }

        public async Task<AuthorDto?> GetAuthorByIdAsync(string id)
        {
            var author = await _context.Authors
                .Include(a => a.Books)
                .Where(a => a.Id == id)
                .Select(a => new AuthorDto
                {
                    Id = a.Id,
                    Name = a.Name,
                    BookIds = a.Books.Select(b => b.Id).ToList()
                })
                .FirstOrDefaultAsync();

            return author;
        }

        public async Task<bool> UpdateAuthorAsync(string id, AuthorDto authorDto)
        {
            var author = await _context.Authors
                .Include(a => a.Books)
                .FirstOrDefaultAsync(a => a.Id == id);

            if (author == null)
            {
                return false;
            }

            author.Name = authorDto.Name;

            author.Books.Clear();
            if (authorDto.BookIds != null && authorDto.BookIds.Any())
            {
                var books = await _context.Books
                    .Where(b => authorDto.BookIds.Contains(b.Id))
                    .ToListAsync();
                author.Books = books;
            }

            await _context.SaveChangesAsync();
            return true;
        }
    }
}
