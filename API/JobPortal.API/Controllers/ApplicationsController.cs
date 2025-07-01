using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using JobPortal.API.DTOs;
using JobPortal.API.Services;
using System.Security.Claims;
using JobPortal.API.Data;
using JobPortal.API.Models; // Needed for ApplicationStatus enum

namespace JobPortal.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class ApplicationsController : ControllerBase
    {
        private readonly IApplicationService _applicationService;
        private readonly ApplicationDbContext _context; // Add DbContext for direct DB access (optional)

        public ApplicationsController(IApplicationService applicationService, ApplicationDbContext context)
        {
            _applicationService = applicationService;
            _context = context;
        }

        [HttpPost("submit/{jobId}")]
        [Authorize(Roles = "User")]
        public async Task<IActionResult> SubmitApplication(int jobId)
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
            var application = await _applicationService.SubmitApplicationAsync(userId, jobId);

            if (application == null)
                return BadRequest(new { message = "Unable to submit application. You may have already applied or the job is inactive." });

            return CreatedAtAction(nameof(GetUserApplications), application);
        }

        [HttpGet("my-applications")]
        [Authorize(Roles = "User")]
        public async Task<IActionResult> GetUserApplications()
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
            var applications = await _applicationService.GetUserApplicationsAsync(userId);
            return Ok(applications);
        }

        [HttpGet]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetAllApplications()
        {
            var applications = await _applicationService.GetAllApplicationsAsync();
            return Ok(applications);
        }

        [HttpGet("job/{jobId}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetJobApplications(int jobId)
        {
            var applications = await _applicationService.GetJobApplicationsAsync(jobId);
            return Ok(applications);
        }

        [HttpPut("{id}/status")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> UpdateApplicationStatus(int id, [FromBody] UpdateApplicationStatusDTO updateDto)
        {
            var application = await _applicationService.UpdateApplicationStatusAsync(id, updateDto);

            if (application == null)
                return NotFound();

            return Ok(application);
        }

        // 🔴 NEW: Endpoint for applicants to delete their own rejected applications
        [HttpDelete("applicant-delete/{id}")]
        [Authorize(Roles = "User")]
        public async Task<IActionResult> DeleteRejectedByApplicant(int id)
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
            var application = await _context.Applications.FindAsync(id);

            if (application == null || application.UserId != userId)
                return NotFound();

            if (application.Status != ApplicationStatus.Rejected)
                return BadRequest("Only rejected applications can be deleted by applicant.");

            _context.Applications.Remove(application);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // 🔴 OPTIONAL: Add admin rejection shortcut that sets status to Rejected
        [HttpPut("{id}/reject")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> RejectApplication(int id)
        {
            var application = await _context.Applications.FindAsync(id);

            if (application == null)
                return NotFound();

            application.Status = ApplicationStatus.Rejected;
            application.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();
            return Ok(new { message = "Application rejected." });
        }
    }
}
