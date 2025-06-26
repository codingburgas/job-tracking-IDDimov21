using JobSearchSystem.API.DTOs;

namespace JobSearchSystem.API.Services;

public interface IJobService
{
    Task<IEnumerable<JobPostingDto>> GetActiveJobsAsync(int? userId = null);
    Task<IEnumerable<JobPostingDto>> GetAllJobsAsync();
    Task<JobPostingDto?> GetJobByIdAsync(int id);
    Task<JobPostingDto> CreateJobAsync(CreateJobPostingDto dto);
    Task<JobPostingDto?> UpdateJobAsync(int id, UpdateJobPostingDto dto);
    Task<bool> DeleteJobAsync(int id);
}