
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using HardwareHub.Application.DTOs;
using HardwareHub.Application.Interfaces;
using HardwareHub.Infrastructure.Data;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using HardwareHub.Domain.Entities;

namespace HardwareHub.Infrastructure.Services;

public class AdminAuthService : IAdminAuthService
{
    private readonly HardwareHubDbContext _context;
    private readonly IConfiguration _configuration;
    private readonly PasswordHasher<AdminUser> _passwordHasher = new();

    public AdminAuthService(
        HardwareHubDbContext context,
        IConfiguration configuration)
    {
        _context = context;
        _configuration = configuration;
    }

    public async Task<AdminLoginResponseDto?> LoginAsync(
        AdminLoginRequestDto request)
    {
        var normalizedEmail = request.Email.Trim().ToUpperInvariant();

        var admin = await _context.AdminUsers
            .FirstOrDefaultAsync(a =>
                a.Email.ToUpper() == normalizedEmail);

        if (admin is null || !admin.IsActive)
            return null;

        var passwordResult = _passwordHasher.VerifyHashedPassword(
            admin,
            admin.PasswordHash,
            request.Password);

        if (passwordResult == PasswordVerificationResult.Failed)
            return null;

        var jwtSettings = _configuration.GetSection("Jwt");
        var key = jwtSettings["Key"]
            ?? throw new InvalidOperationException(
                "JWT signing key is not configured.");

        var issuer = jwtSettings["Issuer"]
            ?? throw new InvalidOperationException(
                "JWT issuer is not configured.");

        var audience = jwtSettings["Audience"]
            ?? throw new InvalidOperationException(
                "JWT audience is not configured.");

        if (Encoding.UTF8.GetByteCount(key) < 32)
            throw new InvalidOperationException(
                "JWT signing key must contain at least 32 UTF-8 bytes.");

        var expiresAt = DateTime.UtcNow.AddMinutes(30);

        var claims = new[]
        {
            new Claim(ClaimTypes.NameIdentifier, admin.Id.ToString()),
            new Claim(ClaimTypes.Name, admin.Name),
            new Claim(ClaimTypes.Email, admin.Email),
            new Claim(ClaimTypes.Role, admin.Role)
        };

        var signingKey = new SymmetricSecurityKey(
            Encoding.UTF8.GetBytes(key));

        var credentials = new SigningCredentials(
            signingKey,
            SecurityAlgorithms.HmacSha256);

        var token = new JwtSecurityToken(
            issuer: issuer,
            audience: audience,
            claims: claims,
            expires: expiresAt,
            signingCredentials: credentials);

        return new AdminLoginResponseDto
        {
            Token = new JwtSecurityTokenHandler().WriteToken(token),
            ExpiresAt = expiresAt,
            Name = admin.Name,
            Email = admin.Email,
            Role = admin.Role
        };
    }



    public async Task<bool> RegisterAsync(AdminRegisterRequestDto request)
    {
        var email = request.Email.Trim().ToLowerInvariant();

        var existingAdmin = await _context.AdminUsers
            .AnyAsync(a => a.Email.ToLower() == email);

        if (existingAdmin)
        {
            return false;
        }

        var admin = new AdminUser
        {
            Id = Guid.NewGuid(),
            Name = request.Name.Trim(),
            Email = email,
            IsActive = true
        };

        admin.PasswordHash = _passwordHasher.HashPassword(
            admin,
            request.Password
        );

        _context.AdminUsers.Add(admin);
        await _context.SaveChangesAsync();

        return true;
    }


}
