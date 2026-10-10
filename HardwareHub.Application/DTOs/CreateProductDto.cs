namespace HardwareHub.Application.DTOs;

public class CreateProductDto
{
    public Guid CategoryId { get; set; }

    public string Name { get; set; } = string.Empty;

    public string Description { get; set; } = string.Empty;

    public decimal Price { get; set; }

    public int StockQuantity { get; set; }

    public string Unit { get; set; } = string.Empty;

    public string? ImageUrl { get; set; }
}