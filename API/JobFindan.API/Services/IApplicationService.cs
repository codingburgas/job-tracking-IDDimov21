using JobFindan.API.DTOs;

namespace JobFindan.API.Services;

public interface IApplicationService
{
    Task<ApplicationDTO?> SubmitApplicationAsync(int userId, int jobPostingId);
    Task<IEnumerable<ApplicationDTO>> GetUserApplicationsAsync(int userId);
    Task<IEnumerable<ApplicationDTO>> GetAllApplicationsAsync();
    Task<IEnumerable<ApplicationDTO>> GetJobApplicationsAsync(int jobPostingId);
    Task<ApplicationDTO?> UpdateApplicationStatusAsync(int id, UpdateApplicationStatusDTO updateDto);
}