using System.ComponentModel.DataAnnotations;
using JobSearchSystem.API.Models;

namespace JobSearchSystem.API.DTOs;

public class JobPostingDto
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Company { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public DateTime DatePosted { get; set; }
    public JobStatus Status { get; set; }
    public int ApplicationCount { get; set; }
    public bool HasApplied { get; set; }
}

public class CreateJobPostingDto
{
    [Required]
    [StringLength(100)]
    public string Title { get; set; } = string.Empty;
    
    [Required]
    [StringLength(100)]
    public string Company { get; set; } = string.Empty;
    
    [Required]
    [StringLength(1000)]
    public string Description { get; set; } = string.Empty;
}

public class UpdateJobPostingDto
{
    [Required]
    [StringLength(100)]
    public string Title { get; set; } = string.Empty;
    
    [Required]
    [StringLength(100)]
    public string Company { get; set; } = string.Empty;
    
    [Required]
    [StringLength(1000)]
    public string Description { get; set; } = string.Empty;
    
    public JobStatus Status { get; set; }
}