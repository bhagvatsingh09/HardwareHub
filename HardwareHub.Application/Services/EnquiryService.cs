
using HardwareHub.Application.DTOs;
using HardwareHub.Application.Interfaces;
using HardwareHub.Domain.Entities;

namespace HardwareHub.Application.Services;

public class EnquiryService
{
    private readonly IEnquiryRepository _enquiryRepository;
    private readonly IProductRepository _productRepository;

    public EnquiryService(
        IEnquiryRepository enquiryRepository,
        IProductRepository productRepository)
    {
        _enquiryRepository = enquiryRepository;
        _productRepository = productRepository;
    }

    public async Task<List<EnquiryDto>> GetAllAsync()
    {
        var enquiries = await _enquiryRepository.GetAllAsync();

        return enquiries.Select(MapToDto).ToList();
    }

    public async Task<EnquiryDto?> GetByIdAsync(Guid id)
    {
        var enquiry = await _enquiryRepository.GetByIdAsync(id);

        if (enquiry is null)
            return null;

        return MapToDto(enquiry);
    }

    public async Task<EnquiryDto?> CreateAsync(CreateEnquiryDto request)
    {
        Product? product = null;

        // A product is optional for general enquiries.
        // If a product ID is supplied, it must exist.
        if (request.ProductId.HasValue)
        {
            product = await _productRepository.GetByIdAsync(
                request.ProductId.Value);

            if (product is null)
                return null;
        }

        var enquiry = new Enquiry
        {
            Id = Guid.NewGuid(),
            ProductId = request.ProductId,
            CustomerName = request.CustomerName.Trim(),
            Phone = request.Phone.Trim(),
            Email = string.IsNullOrWhiteSpace(request.Email)
                ? null
                : request.Email.Trim(),
            Message = request.Message.Trim(),
            Status = EnquiryStatus.New,
            CreatedAt = DateTime.UtcNow,
            Product = product
        };

        var created = await _enquiryRepository.CreateAsync(enquiry);

        return MapToDto(created);
    }

    public async Task<EnquiryDto?> UpdateStatusAsync(
        Guid id,
        UpdateEnquiryStatusDto request)
    {
        var enquiry = await _enquiryRepository.GetByIdAsync(id);

        if (enquiry is null)
            return null;

        enquiry.Status = request.Status;
        enquiry.UpdatedAt = DateTime.UtcNow;

        var updated = await _enquiryRepository.UpdateAsync(enquiry);

        return MapToDto(updated);
    }

    public async Task<bool> DeleteAsync(Guid id)
    {
        return await _enquiryRepository.DeleteAsync(id);
    }

    private static EnquiryDto MapToDto(Enquiry enquiry)
    {
        return new EnquiryDto
        {
            Id = enquiry.Id,
            ProductId = enquiry.ProductId,
            ProductName = enquiry.Product?.Name ?? string.Empty,
            CustomerName = enquiry.CustomerName,
            Phone = enquiry.Phone,
            Email = enquiry.Email,
            Message = enquiry.Message,
            Status = enquiry.Status,
            CreatedAt = enquiry.CreatedAt
        };
    }
}