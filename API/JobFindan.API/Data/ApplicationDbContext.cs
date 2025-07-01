using JobFindan.API.Models;
using Microsoft.EntityFrameworkCore;

namespace JobFindan.API.Data;

public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
    {
    }

    public DbSet<User> Users { get; set; }
    public DbSet<JobPosting> JobPostings { get; set; }
    public DbSet<Application> Applications { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // User configuration
        modelBuilder.Entity<User>(entity =>
        {
            entity.HasIndex(e => e.Username).IsUnique();
            entity.Property(e => e.Role).HasConversion<int>();
        });

        // JobPosting configuration
        modelBuilder.Entity<JobPosting>(entity =>
        {
            entity.Property(e => e.Status).HasConversion<int>();
        });

        // Application configuration
        modelBuilder.Entity<Application>(entity =>
        {
            entity.Property(e => e.Status).HasConversion<int>();
            
            entity.HasOne(e => e.User)
                .WithMany(e => e.Applications)
                .HasForeignKey(e => e.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(e => e.JobPosting)
                .WithMany(e => e.Applications)
                .HasForeignKey(e => e.JobPostingId)
                .OnDelete(DeleteBehavior.Cascade);

            // Ensure one application per user per job
            entity.HasIndex(e => new { e.UserId, e.JobPostingId }).IsUnique();
        });
    }
}