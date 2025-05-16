using JobTracking.DataAccess.Persistance;
using Microsoft.EntityFrameworkCore;
using JobTracking.DataAccess.Data.Models;

namespace JobTracking.DataAccess.Persistance;

public class AppDbContext : DbContext
{
    public DbSet<JobApplication> JobApplications { get; set; }
    public DbSet<User> Users { get; set; }
    
    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        if (!optionsBuilder.IsConfigured)
        {
            optionsBuilder.UseSqlServer("Server=(localdb)\\mssqllocaldb;Database=JobTracking;Trusted_Connection=true");
        }
    }
}