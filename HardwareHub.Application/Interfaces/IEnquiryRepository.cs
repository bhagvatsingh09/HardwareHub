using HardwareHub.Domain.Entities;

namespace HardwareHub.Application.Interfaces;

public interface IEnquiryRepository
{
    Task<List<Enquiry>> GetAllAsync();

    Task<Enquiry?> GetByIdAsync(Guid id);

    Task<Enquiry> CreateAsync(Enquiry enquiry);

    Task<Enquiry> UpdateAsync(Enquiry enquiry);

    Task<bool> DeleteAsync(Guid id);
}