
using HardwareHub.Application.DTOs;
using HardwareHub.Application.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;

namespace HardwareHub.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AdminAuthController : ControllerBase
{
    private readonly IAdminAuthService _adminAuthService;

    public AdminAuthController(IAdminAuthService adminAuthService)
    {
        _adminAuthService = adminAuthService;
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login(
        [FromBody] AdminLoginRequestDto request)
    {
        var result = await _adminAuthService.LoginAsync(request);

        if (result is null)
        {
            return Unauthorized(new
            {
                message = "Invalid email or password, or account inactive."
            });
        }

        return Ok(result);
    }


    [Authorize]
    [HttpPost("register")]
    public async Task<IActionResult> Register(
        [FromBody] AdminRegisterRequestDto request)
    {
        var registered = await _adminAuthService.RegisterAsync(request);

        if (!registered)
        {
            return Conflict(new
            {
                message = "An admin account with this email already exists."
            });
        }

        return Ok(new
        {
            message = "Admin account registered successfully."
        });
    }

}
