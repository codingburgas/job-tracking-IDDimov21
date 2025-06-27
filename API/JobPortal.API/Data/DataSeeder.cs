using JobPortal.API.Models;
using Microsoft.EntityFrameworkCore;

namespace JobPortal.API.Data;

public static class DataSeeder
{
    public static async Task SeedAsync(ApplicationDbContext context)
    {
        // Seed admin user
        if (!await context.Users.AnyAsync(u => u.Role == UserRole.Admin))
        {
            var adminUser = new User
            {
                FirstName = "Admin",
                LastName = "User",
                Username = "admin",
                PasswordHash = BCrypt.Net.BCrypt.HashPassword("admin123"),
                Role = UserRole.Admin
            };
            
            context.Users.Add(adminUser);
            await context.SaveChangesAsync();
        }

        // Seed sample job postings
        if (!await context.JobPostings.AnyAsync())
        {
            var jobPostings = new List<JobPosting>
            {
                new JobPosting
                {
                    Title = "Software Engineer",
                    CompanyName = "Amazon",
                    Description = "Join our dynamic engineering team to develop, test, and optimize scalable web applications. Collaborate with cross-functional teams to build innovative solutions.",
                    JobType = "Full-time",
                    Location = "San Francisco, CA",
                    SalaryRange = "$90,000 - $120,000 / yr",
                    ExperienceLevel = "Mid-Level",
                    Status = JobStatus.Active
                },
                new JobPosting
                {
                    Title = "Product Manager",
                    CompanyName = "Facebook",
                    Description = "Define and execute product strategy to build high-impact digital experiences. You'll collaborate with designers, developers, and marketing teams.",
                    JobType = "Full-time",
                    Location = "Remote",
                    SalaryRange = "$110,000 - $140,000 / yr",
                    ExperienceLevel = "Mid-Level",
                    Status = JobStatus.Active
                },
                new JobPosting
                {
                    Title = "Marketing Specialist",
                    CompanyName = "Netflix",
                    Description = "Develop and implement creative marketing campaigns that engage audiences worldwide. Collaborate with content teams to craft compelling stories.",
                    JobType = "Internship",
                    Location = "Los Angeles, CA",
                    SalaryRange = "$70,000 - $95,000 / yr",
                    ExperienceLevel = "Entry Level",
                    Status = JobStatus.Active
                }
            };

            context.JobPostings.AddRange(jobPostings);
            await context.SaveChangesAsync();
        }
    }
}