using HardwareHub.Application.DTOs;
using HardwareHub.Domain.Entities;

namespace HardwareHub.Application.Interfaces;

    public interface IProductRepository
    {
        Task<List<Product>> GetAllAsync();
        Task<Product?> GetByIdAsync(Guid id);
        Task<Product> CreateAsync(Product product);
        Task<Product?> UpdateAsync(Product product);
    Task<PagedResultDto<Product>> SearchAsync(ProductFilterDto filter);
    Task<bool> DeleteAsync(Guid id);


    }

