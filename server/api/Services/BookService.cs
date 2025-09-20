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
    public class BookService : IBookService
    {
        private readonly NeondbContext _context;

        public BookService(NeondbContext context)
        {
            _context = context;
        }

        public async Task<BookDto> CreateBookAsync(BookDto bookDto)
        {
            var book = new Book
            {
                Id = Guid.NewGuid().ToString(),
                Title = bookDto.Title,
                Pages = bookDto.Pages,
                Genreid = bookDto.GenreId,
                Createdat = DateTime.UtcNow
            };

            if (bookDto.AuthorIds != null && bookDto.AuthorIds.Any())
            {
                var authors = await _context.Authors
                    .Where(a => bookDto.AuthorIds.Contains(a.Id))
                    .ToListAsync();
                book.Authors = authors;
            }

            _context.Books.Add(book);
            await _context.SaveChangesAsync();

            // THE DEFINITIVE FIX
            return new BookDto
            {
                Id = book.Id,
                Title = book.Title,
                Pages = book.Pages,
                GenreId = book.Genreid,
                AuthorIds = bookDto.AuthorIds ?? new List<string>() // Use the original DTO's list safely
            };
        }

        public async Task<bool> DeleteBookAsync(string id)
        {
            var book = await _context.Books.FindAsync(id);
            if (book == null)
            {
                return false;
            }

            _context.Books.Remove(book);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<IEnumerable<BookDto>> GetAllBooksAsync()
        {
            var books = await _context.Books
                .Include(b => b.Authors)
                .Select(b => new BookDto
                {
                    Id = b.Id,
                    Title = b.Title,
                    Pages = b.Pages,
                    GenreId = b.Genreid,
                    AuthorIds = b.Authors.Select(a => a.Id).ToList()
                })
                .ToListAsync();

            return books;
        }

        public async Task<BookDto?> GetBookByIdAsync(string id)
        {
            var book = await _context.Books
                .Include(b => b.Authors)
                .Where(b => b.Id == id)
                .Select(b => new BookDto
                {
                    Id = b.Id,
                    Title = b.Title,
                    Pages = b.Pages,
                    GenreId = b.Genreid,
                    AuthorIds = b.Authors.Select(a => a.Id).ToList()
                })
                .FirstOrDefaultAsync();

            return book;
        }

        public async Task<bool> UpdateBookAsync(string id, BookDto bookDto)
        {
            var book = await _context.Books
                .Include(b => b.Authors)
                .FirstOrDefaultAsync(b => b.Id == id);

            if (book == null)
            {
                return false;
            }

            book.Title = bookDto.Title;
            book.Pages = bookDto.Pages;
            book.Genreid = bookDto.GenreId;

            book.Authors.Clear();
            if (bookDto.AuthorIds != null && bookDto.AuthorIds.Any())
            {
                var authors = await _context.Authors
                    .Where(a => bookDto.AuthorIds.Contains(a.Id))
                    .ToListAsync();
                book.Authors = authors;
            }

            await _context.SaveChangesAsync();
            return true;
        }
    }
}
