namespace HardwareHub.Application.DTOs;

public class LowStockProductDto
{
    public Guid ProductId { get; set; }

    public string Name { get; set; } = string.Empty;

    public int StockQuantity { get; set; }

    public string Unit { get; set; } = string.Empty;
}