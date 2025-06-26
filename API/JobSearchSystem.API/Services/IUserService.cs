using JobSearchSystem.API.DTOs;

namespace JobSearchSystem.API.Services;

public interface IUserService
{
    Task<UserDto?> GetUserByIdAsync(int id);
    Task SeedAdminUserAsync();
}