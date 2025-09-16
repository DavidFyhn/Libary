using System.Collections.Generic;

namespace api.Dtos;

public class AuthorDto
{
    public string Id { get; set; }
    public string Name { get; set; }
    public List<string> BookIds { get; set; } = new();
}
