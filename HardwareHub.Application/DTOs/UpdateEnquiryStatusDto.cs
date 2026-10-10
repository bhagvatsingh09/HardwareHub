using HardwareHub.Domain.Entities;

namespace HardwareHub.Application.DTOs;

public class UpdateEnquiryStatusDto
{
    public EnquiryStatus Status { get; set; }
}