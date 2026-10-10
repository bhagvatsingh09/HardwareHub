
using HardwareHub.Application.Interfaces;
using HardwareHub.Domain.Entities;

namespace HardwareHub.Application.Services;

public class CategoryService
{
    private readonly ICategoryRepository _repository;

    public CategoryService(ICategoryRepository repository)
    {
        _repository = repository;
    }

    public Task<List<Category>> GetAllAsync()
    {
        return _repository.GetAllAsync();
    }

    public Task<Category?> GetByIdAsync(Guid id)
    {
        return _repository.GetByIdAsync(id);
    }

    public async Task<Category> CreateAsync(
        string name,
        string description)
    {
        var category = new Category
        {
            Id = Guid.NewGuid(),
            Name = name.Trim(),
            Description = description.Trim(),
            IsActive = true
        };

        return await _repository.CreateAsync(category);
    }

    public async Task<bool> UpdateAsync(
        Guid id,
        string name,
        string description)
    {
        var category = await _repository.GetByIdAsync(id);

        if (category is null)
            return false;

        category.Name = name.Trim();
        category.Description = description.Trim();

        return await _repository.UpdateAsync(category);
    }

    public Task<bool> SetActiveStatusAsync(
        Guid id,
        bool isActive)
    {
        return _repository.SetActiveStatusAsync(id, isActive);
    }

    public Task<bool> DeleteAsync(Guid id)
    {
        return _repository.DeleteAsync(id);
    }
}