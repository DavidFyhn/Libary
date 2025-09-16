using System.Collections.Generic;

namespace api.Dtos;

public class GenreDto
{
    public string Id { get; set; }
    public string Name { get; set; }
    public List<string> BookIds { get; set; } = new();
}
