namespace api.Dtos;

public class GenreDto
{
    public string Id { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public List<string> BookIds { get; set; } = new();
}
