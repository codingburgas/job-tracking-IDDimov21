using Microsoft.EntityFrameworkCore;
using JobSearchSystem.API.Data;
using JobSearchSystem.API.DTOs;
using JobSearchSystem.API.Models;

namespace JobSearchSystem.API.Services;

public class UserService : IUserService
{
    private readonly ApplicationDbContext _context;

    public UserService(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<UserDto?> GetUserByIdAsync(int id)
    {
        var user = await _context.Users.FindAsync(id);
        if (user == null) return null;

        return new UserDto
        {
            Id = user.Id,
            FirstName = user.FirstName,
            MiddleName = user.MiddleName,
            LastName = user.LastName,
            Username = user.Username,
            Role = user.Role,
            CreatedAt = user.CreatedAt
        };
    }

    public async Task SeedAdminUserAsync()
    {
        if (!await _context.Users.AnyAsync(u => u.Role == UserRole.ADMIN))
        {
            var admin = new User
            {
                FirstName = "System",
                LastName = "Administrator",
                Username = "admin",
                PasswordHash = BCrypt.Net.BCrypt.HashPassword("admin123"),
                Role = UserRole.ADMIN
            };

            _context.Users.Add(admin);
            await _context.SaveChangesAsync();
        }
    }
}