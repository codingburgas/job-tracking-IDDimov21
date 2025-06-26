using JobSearchSystem.API.DTOs;

namespace JobSearchSystem.API.Services;

public interface IAuthService
{
    Task<AuthResponseDto?> LoginAsync(LoginRequestDto request);
    Task<AuthResponseDto?> RegisterAsync(RegisterRequestDto request);
    string GenerateJwtToken(UserDto user);
}