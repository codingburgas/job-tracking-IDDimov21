using System.ComponentModel.DataAnnotations;

namespace JobSearchSystem.API.Models;

public class Application
{
    public int Id { get; set; }
    
    public int UserId { get; set; }
    public User User { get; set; } = null!;
    
    public int JobPostingId { get; set; }
    public JobPosting JobPosting { get; set; } = null!;
    
    public ApplicationStatus Status { get; set; } = ApplicationStatus.Submitted;
    
    public DateTime SubmittedAt { get; set; } = DateTime.UtcNow;
}

public enum ApplicationStatus
{
    Submitted,
    SelectedForInterview,
    Rejected
}