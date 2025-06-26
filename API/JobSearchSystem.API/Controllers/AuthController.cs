using Microsoft.AspNetCore.Mvc;
using JobSearchSystem.API.DTOs;
using JobSearchSystem.API.Services;

namespace JobSearchSystem.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;

    public AuthController(IAuthService authService)
    {
        _authService = authService;
    }

    [HttpPost("login")]
    public async Task<ActionResult<AuthResponseDto>> Login(LoginRequestDto request)
    {
        var result = await _authService.LoginAsync(request);
        
        if (result == null)
            return BadRequest(new { message = "Invalid username or password" });

        return Ok(result);
    }

    [HttpPost("register")]
    public async Task<ActionResult<AuthResponseDto>> Register(RegisterRequestDto request)
    {
        var result = await _authService.RegisterAsync(request);
        
        if (result == null)
            return BadRequest(new { message = "Username already exists" });

        return Ok(result);
    }
}