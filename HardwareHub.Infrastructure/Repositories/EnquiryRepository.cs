using HardwareHub.Application.Interfaces;
using HardwareHub.Domain.Entities;
using HardwareHub.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace HardwareHub.Infrastructure.Repositories;

public class EnquiryRepository : IEnquiryRepository
{
    private readonly HardwareHubDbContext _context;

    public EnquiryRepository(HardwareHubDbContext context)
    {
        _context = context;
    }

    public async Task<List<Enquiry>> GetAllAsync()
    {
        return await _context.Enquiries
            .Include(e => e.Product)
            .OrderByDescending(e => e.CreatedAt)
            .ToListAsync();
    }

    public async Task<Enquiry?> GetByIdAsync(Guid id)
    {
        return await _context.Enquiries
            .Include(e => e.Product)
            .FirstOrDefaultAsync(e => e.Id == id);
    }

    public async Task<Enquiry> CreateAsync(Enquiry enquiry)
    {
        _context.Enquiries.Add(enquiry);

        await _context.SaveChangesAsync();

        return enquiry;
    }

    public async Task<Enquiry> UpdateAsync(Enquiry enquiry)
    {
        _context.Enquiries.Update(enquiry);

        await _context.SaveChangesAsync();

        return enquiry;
    }

    public async Task<bool> DeleteAsync(Guid id)
    {
        var enquiry = await _context.Enquiries
            .FirstOrDefaultAsync(e => e.Id == id);

        if (enquiry is null)
            return false;

        _context.Enquiries.Remove(enquiry);

        await _context.SaveChangesAsync();

        return true;
    }
}