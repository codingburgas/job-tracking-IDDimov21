using Microsoft.EntityFrameworkCore;
using JobTracking.DAL.Models;

namespace JobTracking.DAL;

public class JobTrackingContext : DbContext {
    public JobTrackingContext(DbContextOptions<JobTrackingContext> options) : base(options) { }

    public DbSet<User> Users => Set<User>();
    public DbSet<JobPosting> JobPostings => Set<JobPosting>();
    public DbSet<Application> Applications => Set<Application>();

    protected override void OnModelCreating(ModelBuilder modelBuilder) {
        modelBuilder.Entity<Application>()
            .HasIndex(a => new { a.UserId, a.JobPostingId })
            .IsUnique();

        modelBuilder.Entity<Application>()
            .HasOne(a => a.User)
            .WithMany()
            .HasForeignKey(a => a.UserId);

        modelBuilder.Entity<Application>()
            .HasOne(a => a.JobPosting)
            .WithMany()
            .HasForeignKey(a => a.JobPostingId);
    }
}