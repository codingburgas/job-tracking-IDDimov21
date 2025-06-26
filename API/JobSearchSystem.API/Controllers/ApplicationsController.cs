using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using JobSearchSystem.API.DTOs;
using JobSearchSystem.API.Services;

namespace JobSearchSystem.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class ApplicationsController : ControllerBase
{
    private readonly IApplicationService _applicationService;

    public ApplicationsController(IApplicationService applicationService)
    {
        _applicationService = applicationService;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<ApplicationDto>>> GetApplications()
    {
        var userRole = User.FindFirstValue(ClaimTypes.Role);
        
        if (userRole == "ADMIN")
        {
            var allApplications = await _applicationService.GetAllApplicationsAsync();
            return Ok(allApplications);
        }
        else
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var userApplications = await _applicationService.GetUserApplicationsAsync(userId);
            return Ok(userApplications);
        }
    }

    [HttpGet("job/{jobId}")]
    [Authorize(Roles = "ADMIN")]
    public async Task<ActionResult<IEnumerable<ApplicationDto>>> GetJobApplications(int jobId)
    {
        var applications = await _applicationService.GetJobApplicationsAsync(jobId);
        return Ok(applications);
    }

    [HttpPost("job/{jobId}")]
    [Authorize(Roles = "USER")]
    public async Task<ActionResult<ApplicationDto>> CreateApplication(int jobId)
    {
        var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var application = await _applicationService.CreateApplicationAsync(userId, jobId);
        
        if (application == null)
            return BadRequest(new { message = "Unable to create application. You may have already applied or the job is not active." });

        return CreatedAtAction(nameof(GetApplications), new { id = application.Id }, application);
    }

    [HttpPut("{id}/status")]
    [Authorize(Roles = "ADMIN")]
    public async Task<ActionResult<ApplicationDto>> UpdateApplicationStatus(int id, UpdateApplicationStatusDto dto)
    {
        var application = await _applicationService.UpdateApplicationStatusAsync(id, dto);
        
        if (application == null)
            return NotFound();

        return Ok(application);
    }
}