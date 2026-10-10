
using HardwareHub.Application.DTOs;

namespace HardwareHub.Application.Interfaces;

public interface IAdminAuthService
{
    Task<AdminLoginResponseDto?> LoginAsync(
        AdminLoginRequestDto request);

    Task<bool> RegisterAsync(AdminRegisterRequestDto request);
}

