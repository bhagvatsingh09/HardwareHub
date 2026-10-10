namespace HardwareHub.Application.DTOs;

public class ProductFilterDto
{
    public string? Search { get; set; }

    public Guid? CategoryId { get; set; }

    public bool? AvailableOnly { get; set; }

    public int Page { get; set; } = 1;

    public int PageSize { get; set; } = 10;

    public string? SortBy { get; set; }

    public string? SortOrder { get; set; }
}