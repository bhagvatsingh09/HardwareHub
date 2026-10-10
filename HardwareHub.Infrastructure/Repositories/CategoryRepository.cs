
using HardwareHub.Application.Interfaces;
using HardwareHub.Domain.Entities;
using HardwareHub.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace HardwareHub.Infrastructure.Repositories;

public class CategoryRepository : ICategoryRepository
{
    private readonly HardwareHubDbContext _context;

    public CategoryRepository(HardwareHubDbContext context)
    {
        _context = context;
    }

    public async Task<List<Category>> GetAllAsync()
    {
        return await _context.Categories
            .AsNoTracking()
            .OrderBy(c => c.Name)
            .ToListAsync();
    }

    public async Task<Category?> GetByIdAsync(Guid id)
    {
        return await _context.Categories
            .AsNoTracking()
            .FirstOrDefaultAsync(c => c.Id == id);
    }

    public async Task<Category> CreateAsync(Category category)
    {
        _context.Categories.Add(category);
        await _context.SaveChangesAsync();

        return category;
    }

    public async Task<bool> UpdateAsync(Category category)
    {
        var existingCategory = await _context.Categories
            .FirstOrDefaultAsync(c => c.Id == category.Id);

        if (existingCategory is null)
            return false;

        existingCategory.Name = category.Name;
        existingCategory.Description = category.Description;

        await _context.SaveChangesAsync();

        return true;
    }

    public async Task<bool> SetActiveStatusAsync(
        Guid id,
        bool isActive)
    {
        var category = await _context.Categories
            .FirstOrDefaultAsync(c => c.Id == id);

        if (category is null)
            return false;

        category.IsActive = isActive;

        await _context.SaveChangesAsync();

        return true;
    }

    public Task<bool> DeleteAsync(Guid id)
    {
        return SetActiveStatusAsync(id, false);
    }
}