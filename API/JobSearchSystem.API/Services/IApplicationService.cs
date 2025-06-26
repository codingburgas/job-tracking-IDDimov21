using JobSearchSystem.API.DTOs;

namespace JobSearchSystem.API.Services;

public interface IApplicationService
{
    Task<IEnumerable<ApplicationDto>> GetUserApplicationsAsync(int userId);
    Task<IEnumerable<ApplicationDto>> GetJobApplicationsAsync(int jobId);
    Task<IEnumerable<ApplicationDto>> GetAllApplicationsAsync();
    Task<ApplicationDto?> CreateApplicationAsync(int userId, int jobId);
    Task<ApplicationDto?> UpdateApplicationStatusAsync(int id, UpdateApplicationStatusDto dto);
}