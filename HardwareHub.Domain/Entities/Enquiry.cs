
namespace HardwareHub.Domain.Entities;

public class Enquiry
{
    public Guid Id { get; set; }

    public Guid? ProductId { get; set; }

    public string CustomerName { get; set; } = string.Empty;

    public string Phone { get; set; } = string.Empty;

    public string? Email { get; set; }

    public string Message { get; set; } = string.Empty;

    public EnquiryStatus Status { get; set; } = EnquiryStatus.New;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public DateTime? UpdatedAt { get; set; }

    public Product? Product { get; set; }
}

public enum EnquiryStatus
{
    New,
    Contacted,
    Resolved
}