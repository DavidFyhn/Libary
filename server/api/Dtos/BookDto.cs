using System.Collections.Generic;

namespace api.Dtos;

public class BookDto
{
    public string Id { get; set; }
    public string Title { get; set; }
    public int Pages { get; set; }
    public string? GenreId { get; set; }
    public List<string> AuthorIds { get; set; } = new();
}
