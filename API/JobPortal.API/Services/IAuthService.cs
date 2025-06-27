using JobPortal.API.DTOs;

namespace JobPortal.API.Services;

public interface IAuthService
{
    Task<AuthResponseDTO?> RegisterAsync(RegisterDTO registerDto);
    Task<AuthResponseDTO?> LoginAsync(LoginDTO loginDto);
}