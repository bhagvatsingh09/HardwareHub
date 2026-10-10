using HardwareHub.Domain.Entities;

namespace HardwareHub.Application.DTOs;

public class EnquiryDto
{
    public Guid Id { get; set; }

    public Guid? ProductId { get; set; }

    public string ProductName { get; set; } = string.Empty;

    public string CustomerName { get; set; } = string.Empty;

    public string Phone { get; set; } = string.Empty;

    public string? Email { get; set; }

    public string Message { get; set; } = string.Empty;

    public EnquiryStatus Status { get; set; }

    public DateTime CreatedAt { get; set; }
}