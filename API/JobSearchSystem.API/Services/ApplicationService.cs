using Microsoft.EntityFrameworkCore;
using JobSearchSystem.API.Data;
using JobSearchSystem.API.DTOs;
using JobSearchSystem.API.Models;

namespace JobSearchSystem.API.Services;

public class ApplicationService : IApplicationService
{
    private readonly ApplicationDbContext _context;

    public ApplicationService(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<ApplicationDto>> GetUserApplicationsAsync(int userId)
    {
        var applications = await _context.Applications
            .Include(a => a.User)
            .Include(a => a.JobPosting)
            .Where(a => a.UserId == userId)
            .ToListAsync();

        return applications.Select(a => new ApplicationDto
        {
            Id = a.Id,
            UserId = a.UserId,
            UserName = $"{a.User.FirstName} {a.User.LastName}",
            JobPostingId = a.JobPostingId,
            JobTitle = a.JobPosting.Title,
            Company = a.JobPosting.Company,
            Status = a.Status,
            SubmittedAt = a.SubmittedAt
        });
    }

    public async Task<IEnumerable<ApplicationDto>> GetJobApplicationsAsync(int jobId)
    {
        var applications = await _context.Applications
            .Include(a => a.User)
            .Include(a => a.JobPosting)
            .Where(a => a.JobPostingId == jobId)
            .ToListAsync();

        return applications.Select(a => new ApplicationDto
        {
            Id = a.Id,
            UserId = a.UserId,
            UserName = $"{a.User.FirstName} {a.User.LastName}",
            JobPostingId = a.JobPostingId,
            JobTitle = a.JobPosting.Title,
            Company = a.JobPosting.Company,
            Status = a.Status,
            SubmittedAt = a.SubmittedAt
        });
    }

    public async Task<IEnumerable<ApplicationDto>> GetAllApplicationsAsync()
    {
        var applications = await _context.Applications
            .Include(a => a.User)
            .Include(a => a.JobPosting)
            .ToListAsync();

        return applications.Select(a => new ApplicationDto
        {
            Id = a.Id,
            UserId = a.UserId,
            UserName = $"{a.User.FirstName} {a.User.LastName}",
            JobPostingId = a.JobPostingId,
            JobTitle = a.JobPosting.Title,
            Company = a.JobPosting.Company,
            Status = a.Status,
            SubmittedAt = a.SubmittedAt
        });
    }

    public async Task<ApplicationDto?> CreateApplicationAsync(int userId, int jobId)
    {
        // Check if user already applied to this job
        if (await _context.Applications.AnyAsync(a => a.UserId == userId && a.JobPostingId == jobId))
            return null;

        // Check if job exists and is active
        var job = await _context.JobPostings.FindAsync(jobId);
        if (job == null || job.Status != JobStatus.Active)
            return null;

        var application = new Application
        {
            UserId = userId,
            JobPostingId = jobId,
            Status = ApplicationStatus.Submitted,
            SubmittedAt = DateTime.UtcNow
        };

        _context.Applications.Add(application);
        await _context.SaveChangesAsync();

        // Load related data
        await _context.Entry(application)
            .Reference(a => a.User)
            .LoadAsync();
        await _context.Entry(application)
            .Reference(a => a.JobPosting)
            .LoadAsync();

        return new ApplicationDto
        {
            Id = application.Id,
            UserId = application.UserId,
            UserName = $"{application.User.FirstName} {application.User.LastName}",
            JobPostingId = application.JobPostingId,
            JobTitle = application.JobPosting.Title,
            Company = application.JobPosting.Company,
            Status = application.Status,
            SubmittedAt = application.SubmittedAt
        };
    }

    public async Task<ApplicationDto?> UpdateApplicationStatusAsync(int id, UpdateApplicationStatusDto dto)
    {
        var application = await _context.Applications
            .Include(a => a.User)
            .Include(a => a.JobPosting)
            .FirstOrDefaultAsync(a => a.Id == id);

        if (application == null) return null;

        application.Status = dto.Status;
        await _context.SaveChangesAsync();

        return new ApplicationDto
        {
            Id = application.Id,
            UserId = application.UserId,
            UserName = $"{application.User.FirstName} {application.User.LastName}",
            JobPostingId = application.JobPostingId,
            JobTitle = application.JobPosting.Title,
            Company = application.JobPosting.Company,
            Status = application.Status,
            SubmittedAt = application.SubmittedAt
        };
    }
}