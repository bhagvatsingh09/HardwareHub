using HardwareHub.Application.DTOs;
using HardwareHub.Application.Interfaces;
using HardwareHub.Domain.Entities;
using HardwareHub.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace HardwareHub.Infrastructure.Repositories;

public class ProductRepository : IProductRepository
{
    private readonly HardwareHubDbContext _context;

    public ProductRepository(HardwareHubDbContext context)
    {
        _context = context;
    }

    public async Task<List<Product>> GetAllAsync()
    {
        return await _context.Products
            .Include(p => p.Category)
            .AsNoTracking()
            .OrderBy(p => p.Name)
            .ToListAsync();
    }

    public async Task<Product?> GetByIdAsync(Guid id)
    {
        return await _context.Products
            .Include(p => p.Category)
            .AsNoTracking()
            .FirstOrDefaultAsync(p => p.Id == id);
    }

    public async Task<Product> CreateAsync(Product product)
    {
        _context.Products.Add(product);
        await _context.SaveChangesAsync();

        return product;
    }

    public async Task<Product?> UpdateAsync(Product product)
    {
        var existingProduct = await _context.Products
            .FirstOrDefaultAsync(p => p.Id == product.Id);

        if (existingProduct is null)
            return null;

        existingProduct.Name = product.Name;
        existingProduct.Description = product.Description;
        existingProduct.Price = product.Price;
        existingProduct.StockQuantity = product.StockQuantity;
        existingProduct.Unit = product.Unit;
        existingProduct.ImageUrl = product.ImageUrl;
        existingProduct.IsAvailable = product.IsAvailable;
        existingProduct.CategoryId = product.CategoryId;
        existingProduct.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        return existingProduct;
    }


    public async Task<bool> DeleteAsync(Guid id)
    {
        var product = await _context.Products
            .FirstOrDefaultAsync(p => p.Id == id);

        if (product is null)
            return false;

        _context.Products.Remove(product);

        await _context.SaveChangesAsync();

        return true;
    }

    public async Task<PagedResultDto<Product>> SearchAsync(
    ProductFilterDto filter)
    {
        var query = _context.Products
            .Include(p => p.Category)
            .AsQueryable();

        if (!string.IsNullOrWhiteSpace(filter.Search))
        {
            query = query.Where(p =>
                p.Name.Contains(filter.Search) ||
                p.Description.Contains(filter.Search));
        }

        if (filter.CategoryId.HasValue)
        {
            query = query.Where(p =>
                p.CategoryId == filter.CategoryId.Value);
        }

        if (filter.AvailableOnly.HasValue && filter.AvailableOnly.Value)
        {
            query = query.Where(p => p.IsAvailable);
        }

        var totalCount = await query.CountAsync();

        var page = filter.Page < 1 ? 1 : filter.Page;
        var pageSize = filter.PageSize < 1 ? 10 : filter.PageSize;

        var sortBy = filter.SortBy?.ToLower();
        var sortOrder = filter.SortOrder?.ToLower();

        if (sortBy == "price")
        {
            query = sortOrder == "desc"
                ? query.OrderByDescending(p => p.Price)
                : query.OrderBy(p => p.Price);
        }
        else if (sortBy == "stock")
        {
            query = sortOrder == "desc"
                ? query.OrderByDescending(p => p.StockQuantity)
                : query.OrderBy(p => p.StockQuantity);
        }
        else
        {
            query = sortOrder == "desc"
                ? query.OrderByDescending(p => p.Name)
                : query.OrderBy(p => p.Name);
        }

        var products = await query
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        var totalPages = (int)Math.Ceiling(
            totalCount / (double)pageSize);

        return new PagedResultDto<Product>
        {
            Items = products,
            Page = page,
            PageSize = pageSize,
            TotalCount = totalCount,
            TotalPages = totalPages
        };
    }
}