namespace JobTracking.DAL.Models;

public enum ApplicationStatus {
    Submitted,
    Interview,
    Rejected
}

public class Application {
    public int Id { get; set; }
    public int UserId { get; set; }
    public int JobPostingId { get; set; }
    public ApplicationStatus Status { get; set; }

    public User User { get; set; } = null!;
    public JobPosting JobPosting { get; set; } = null!;
}