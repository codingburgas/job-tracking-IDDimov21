using Microsoft.AspNetCore.Mvc;
using JobTracking.BLL.Services;
using JobTracking.DAL.Models;

namespace JobTracking.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase {
    private readonly UserService _userService;

    public AuthController(UserService userService) => _userService = userService;

    [HttpPost("login")]
    public IActionResult Login([FromBody] LoginDto dto) {
        var user = _userService.Authenticate(dto.Username, dto.Password);
        return user == null ? Unauthorized("Invalid credentials") : Ok(user);
    }

    [HttpPost("register")]
    public IActionResult Register([FromBody] RegisterDto dto) {
        try {
            var user = new User {
                FirstName = dto.FirstName,
                MiddleName = dto.MiddleName,
                LastName = dto.LastName,
                Username = dto.Username,
                Password = dto.Password,
                Role = Role.USER
            };
            _userService.Register(user);
            return Ok();
        } catch (Exception ex) {
            return BadRequest(ex.Message);
        }
    }
}

public class LoginDto {
    public string Username { get; set; } = null!;
    public string Password { get; set; } = null!;
}

public class RegisterDto {
    public string FirstName { get; set; } = null!;
    public string MiddleName { get; set; } = null!;
    public string LastName { get; set; } = null!;
    public string Username { get; set; } = null!;
    public string Password { get; set; } = null!;
}