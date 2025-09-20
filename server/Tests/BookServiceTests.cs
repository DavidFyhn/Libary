using api.Dtos;
using api.Services;
using DataAccess.Data;
using Microsoft.Extensions.DependencyInjection;
using Xunit;

namespace Tests;

public class BookServiceTests : IClassFixture<Setup>
{
    private readonly Setup _setup;

    public BookServiceTests(Setup setup)
    {
        _setup = setup;
    }

    [Fact]
    public async Task GetAllBooksAsync_ShouldReturnAllBooks_WhenBooksExist()
    {
        // Arrange
        // Get a fresh, scoped service provider for this specific test
        await using var scope = _setup.Services.CreateAsyncScope();
        var bookService = scope.ServiceProvider.GetRequiredService<IBookService>();
        var dbContext = scope.ServiceProvider.GetRequiredService<NeondbContext>();
        
        // Ensure the database schema is created in the test container
        await dbContext.Database.EnsureCreatedAsync();
        
        var newBook = new BookDto { Title = "Test Book", Pages = 100 };
        await bookService.CreateBookAsync(newBook);

        // Act
        var result = await bookService.GetAllBooksAsync();

        // Assert
        Assert.NotNull(result);
        var bookDtos = result.ToList();
        Assert.Single(bookDtos);
        Assert.Equal("Test Book", bookDtos.First().Title);
    }
}
