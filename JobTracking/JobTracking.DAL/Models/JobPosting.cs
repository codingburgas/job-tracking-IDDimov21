namespace JobTracking.DAL.Models;

public class JobPosting {
    public int Id { get; set; }
    public string Title { get; set; } = null!;
    public string Company { get; set; } = null!;
    public string Description { get; set; } = null!;
    public DateTime PostedAt { get; set; }
    public bool IsActive { get; set; }
}