
using HardwareHub.Domain.Entities;

namespace HardwareHub.Application.Interfaces;

public interface ICategoryRepository
{
    Task<List<Category>> GetAllAsync();

    Task<Category?> GetByIdAsync(Guid id);

    Task<Category> CreateAsync(Category category);

    Task<bool> UpdateAsync(Category category);

    Task<bool> SetActiveStatusAsync(Guid id, bool isActive);

    Task<bool> DeleteAsync(Guid id);
}