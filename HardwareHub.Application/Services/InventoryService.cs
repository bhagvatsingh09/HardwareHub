using HardwareHub.Application.DTOs;
using HardwareHub.Application.Interfaces;

namespace HardwareHub.Application.Services;

public class InventoryService
{
    private readonly IProductRepository _productRepository;

    public InventoryService(IProductRepository productRepository)
    {
        _productRepository = productRepository;
    }

    public async Task<bool> IncreaseStockAsync(Guid productId, int quantity)
    {
        if (quantity <= 0)
            return false;

        var product = await _productRepository.GetByIdAsync(productId);

        if (product is null)
            return false;

        product.StockQuantity += quantity;
        product.IsAvailable = true;
        product.UpdatedAt = DateTime.UtcNow;

        await _productRepository.UpdateAsync(product);

        return true;
    }

    public async Task<bool> DecreaseStockAsync(Guid productId, int quantity)
    {
        if (quantity <= 0)
            return false;

        var product = await _productRepository.GetByIdAsync(productId);

        if (product is null)
            return false;

        if (product.StockQuantity < quantity)
            return false;

        product.StockQuantity -= quantity;
        product.IsAvailable = product.StockQuantity > 0;
        product.UpdatedAt = DateTime.UtcNow;

        await _productRepository.UpdateAsync(product);

        return true;
    }

    public async Task<List<LowStockProductDto>> GetLowStockProductsAsync(
    int threshold = 10)
    {
        var products = await _productRepository.GetAllAsync();

        return products
            .Where(p => p.StockQuantity > 0 && p.StockQuantity <= threshold)
            .Select(p => new LowStockProductDto
            {
                ProductId = p.Id,
                Name = p.Name,
                StockQuantity = p.StockQuantity,
                Unit = p.Unit
            })
            .ToList();
    }
}