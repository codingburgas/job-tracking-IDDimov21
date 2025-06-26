using Microsoft.EntityFrameworkCore;
using JobSearchSystem.API.Data;
using JobSearchSystem.API.DTOs;
using JobSearchSystem.API.Models;

namespace JobSearchSystem.API.Services;

public class JobService : IJobService
{
    private readonly ApplicationDbContext _context;

    public JobService(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<JobPostingDto>> GetActiveJobsAsync(int? userId = null)
    {
        var query = _context.JobPostings
            .Where(j => j.Status == JobStatus.Active)
            .Include(j => j.Applications);

        var jobs = await query.ToListAsync();

        return jobs.Select(j => new JobPostingDto
        {
            Id = j.Id,
            Title = j.Title,
            Company = j.Company,
            Description = j.Description,
            DatePosted = j.DatePosted,
            Status = j.Status,
            ApplicationCount = j.Applications.Count,
            HasApplied = userId.HasValue && j.Applications.Any(a => a.UserId == userId.Value)
        });
    }

    public async Task<IEnumerable<JobPostingDto>> GetAllJobsAsync()
    {
        var jobs = await _context.JobPostings
            .Include(j => j.Applications)
            .ToListAsync();

        return jobs.Select(j => new JobPostingDto
        {
            Id = j.Id,
            Title = j.Title,
            Company = j.Company,
            Description = j.Description,
            DatePosted = j.DatePosted,
            Status = j.Status,
            ApplicationCount = j.Applications.Count,
            HasApplied = false
        });
    }

    public async Task<JobPostingDto?> GetJobByIdAsync(int id)
    {
        var job = await _context.JobPostings
            .Include(j => j.Applications)
            .FirstOrDefaultAsync(j => j.Id == id);

        if (job == null) return null;

        return new JobPostingDto
        {
            Id = job.Id,
            Title = job.Title,
            Company = job.Company,
            Description = job.Description,
            DatePosted = job.DatePosted,
            Status = job.Status,
            ApplicationCount = job.Applications.Count,
            HasApplied = false
        };
    }

    public async Task<JobPostingDto> CreateJobAsync(CreateJobPostingDto dto)
    {
        var job = new JobPosting
        {
            Title = dto.Title,
            Company = dto.Company,
            Description = dto.Description,
            DatePosted = DateTime.UtcNow,
            Status = JobStatus.Active
        };

        _context.JobPostings.Add(job);
        await _context.SaveChangesAsync();

        return new JobPostingDto
        {
            Id = job.Id,
            Title = job.Title,
            Company = job.Company,
            Description = job.Description,
            DatePosted = job.DatePosted,
            Status = job.Status,
            ApplicationCount = 0,
            HasApplied = false
        };
    }

    public async Task<JobPostingDto?> UpdateJobAsync(int id, UpdateJobPostingDto dto)
    {
        var job = await _context.JobPostings.FindAsync(id);
        if (job == null) return null;

        job.Title = dto.Title;
        job.Company = dto.Company;
        job.Description = dto.Description;
        job.Status = dto.Status;

        await _context.SaveChangesAsync();

        return new JobPostingDto
        {
            Id = job.Id,
            Title = job.Title,
            Company = job.Company,
            Description = job.Description,
            DatePosted = job.DatePosted,
            Status = job.Status,
            ApplicationCount = job.Applications?.Count ?? 0,
            HasApplied = false
        };
    }

    public async Task<bool> DeleteJobAsync(int id)
    {
        var job = await _context.JobPostings.FindAsync(id);
        if (job == null) return false;

        _context.JobPostings.Remove(job);
        await _context.SaveChangesAsync();
        return true;
    }
}