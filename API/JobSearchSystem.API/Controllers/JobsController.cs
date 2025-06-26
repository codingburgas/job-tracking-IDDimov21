using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using JobSearchSystem.API.DTOs;
using JobSearchSystem.API.Services;

namespace JobSearchSystem.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class JobsController : ControllerBase
{
    private readonly IJobService _jobService;

    public JobsController(IJobService jobService)
    {
        _jobService = jobService;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<JobPostingDto>>> GetJobs()
    {
        var userRole = User.FindFirstValue(ClaimTypes.Role);
        
        if (userRole == "ADMIN")
        {
            var allJobs = await _jobService.GetAllJobsAsync();
            return Ok(allJobs);
        }
        else
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var activeJobs = await _jobService.GetActiveJobsAsync(userId);
            return Ok(activeJobs);
        }
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<JobPostingDto>> GetJob(int id)
    {
        var job = await _jobService.GetJobByIdAsync(id);
        
        if (job == null)
            return NotFound();

        return Ok(job);
    }

    [HttpPost]
    [Authorize(Roles = "ADMIN")]
    public async Task<ActionResult<JobPostingDto>> CreateJob(CreateJobPostingDto dto)
    {
        var job = await _jobService.CreateJobAsync(dto);
        return CreatedAtAction(nameof(GetJob), new { id = job.Id }, job);
    }

    [HttpPut("{id}")]
    [Authorize(Roles = "ADMIN")]
    public async Task<ActionResult<JobPostingDto>> UpdateJob(int id, UpdateJobPostingDto dto)
    {
        var job = await _jobService.UpdateJobAsync(id, dto);
        
        if (job == null)
            return NotFound();

        return Ok(job);
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "ADMIN")]
    public async Task<IActionResult> DeleteJob(int id)
    {
        var result = await _jobService.DeleteJobAsync(id);
        
        if (!result)
            return NotFound();

        return NoContent();
    }
}