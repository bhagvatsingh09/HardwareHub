using HardwareHub.Application.DTOs;
using HardwareHub.Application.Interfaces;
using HardwareHub.Domain.Entities;

namespace HardwareHub.Application.Services;

public class ProductService
{
    private readonly IProductRepository _productRepository;
    private readonly ICategoryRepository _categoryRepository;

    public async Task<PagedResultDto<ProductDto>> SearchAsync(
    ProductFilterDto filter)
    {
        var result = await _productRepository.SearchAsync(filter);

        return new PagedResultDto<ProductDto>
        {
            Items = result.Items.Select(MapToDto).ToList(),
            Page = result.Page,
            PageSize = result.PageSize,
            TotalCount = result.TotalCount,
            TotalPages = result.TotalPages
        };
    }
    public ProductService(
        IProductRepository productRepository,
        ICategoryRepository categoryRepository)
    {
        _productRepository = productRepository;
        _categoryRepository = categoryRepository;
    }

    public async Task<List<ProductDto>> GetAllAsync()
    {
        var products = await _productRepository.GetAllAsync();

        return products.Select(MapToDto).ToList();
    }

    public async Task<ProductDto?> GetByIdAsync(Guid id)
    {
        var product = await _productRepository.GetByIdAsync(id);

        return product is null ? null : MapToDto(product);
    }

    public async Task<ProductDto?> CreateAsync(CreateProductDto request)
    {
        var category = await _categoryRepository.GetByIdAsync(request.CategoryId);

        if (category is null)
            return null;

        var product = new Product
        {
            Id = Guid.NewGuid(),
            CategoryId = request.CategoryId,
            Name = request.Name,
            Description = request.Description,
            Price = request.Price,
            StockQuantity = request.StockQuantity,
            Unit = request.Unit,
            ImageUrl = request.ImageUrl,
            IsAvailable = true,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = null
        };

        var createdProduct = await _productRepository.CreateAsync(product);

        // The repository returns the created entity, but Category
        // has not been loaded into it yet.
        createdProduct.Category = category;

        return MapToDto(createdProduct);
    }

    public async Task<ProductDto?> UpdateAsync(
        Guid id,
        UpdateProductDto request)
    {
        var category = await _categoryRepository.GetByIdAsync(request.CategoryId);

        if (category is null)
            return null;

        var existingProduct = await _productRepository.GetByIdAsync(id);

        if (existingProduct is null)
            return null;

        existingProduct.CategoryId = request.CategoryId;
        existingProduct.Name = request.Name;
        existingProduct.Description = request.Description;
        existingProduct.Price = request.Price;
        existingProduct.StockQuantity = request.StockQuantity;
        existingProduct.Unit = request.Unit;
        existingProduct.ImageUrl = request.ImageUrl;
        existingProduct.IsAvailable = request.IsAvailable;
        existingProduct.UpdatedAt = DateTime.UtcNow;

        var updatedProduct = await _productRepository.UpdateAsync(existingProduct);

        if (updatedProduct is null)
            return null;

        updatedProduct.Category = category;

        return MapToDto(updatedProduct);
    }

    public Task<bool> DeleteAsync(Guid id)
    {
        return _productRepository.DeleteAsync(id);
    }

    private static ProductDto MapToDto(Product product)
    {
        return new ProductDto
        {
            Id = product.Id,
            CategoryId = product.CategoryId,
            Name = product.Name,
            Description = product.Description,
            Price = product.Price,
            StockQuantity = product.StockQuantity,
            Unit = product.Unit,
            ImageUrl = product.ImageUrl,
            IsAvailable = product.IsAvailable,
            CreatedAt = product.CreatedAt,
            UpdatedAt = product.UpdatedAt,

            Category = product.Category is null
                ? null
                : new CategoryDto
                {
                    Id = product.Category.Id,
                    Name = product.Category.Name,
                    Description = product.Category.Description,
                    IsActive = product.Category.IsActive
                }
        };
    }


}