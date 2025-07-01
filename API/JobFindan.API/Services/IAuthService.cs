using JobFindan.API.DTOs;

namespace JobFindan.API.Services;

public interface IAuthService
{
    Task<AuthResponseDTO?> RegisterAsync(RegisterDTO registerDto);
    Task<AuthResponseDTO?> LoginAsync(LoginDTO loginDto);
}