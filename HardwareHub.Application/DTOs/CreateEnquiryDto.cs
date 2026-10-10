
namespace HardwareHub.Application.DTOs;

public class CreateEnquiryDto
{
    public Guid? ProductId { get; set; }

    public string CustomerName { get; set; } = string.Empty;

    public string Phone { get; set; } = string.Empty;

    public string? Email { get; set; }

    public string Message { get; set; } = string.Empty;
}