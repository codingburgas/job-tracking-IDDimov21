using JobSearchSystem.API.Models;

namespace JobSearchSystem.API.DTOs;

public class ApplicationDto
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public string UserName { get; set; } = string.Empty;
    public int JobPostingId { get; set; }
    public string JobTitle { get; set; } = string.Empty;
    public string Company { get; set; } = string.Empty;
    public ApplicationStatus Status { get; set; }
    public DateTime SubmittedAt { get; set; }
}

public class UpdateApplicationStatusDto
{
    public ApplicationStatus Status { get; set; }
}