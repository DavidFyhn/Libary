namespace api.Dtos;

public class BookDto
{
    public string Id { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public int Pages { get; set; }
    public string? GenreId { get; set; }
    public List<string> AuthorIds { get; set; } = new();
}
