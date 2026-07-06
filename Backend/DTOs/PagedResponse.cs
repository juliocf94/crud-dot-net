namespace Backend.DTOs;

public class PagedResponse<T>
{
    public int Total { get; set; }

    public int Page { get; set; }

    public int PageSize { get; set; }

    public int TotalPages { get; set; }

    public List<T> Data { get; set; } = new();
}