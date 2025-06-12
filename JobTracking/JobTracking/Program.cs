using JobTracking.DAL;
using JobTracking.BLL.Services;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllersWithViews();
builder.Services.AddRazorPages();

// DB context
builder.Services.AddDbContext<JobTrackingContext>(options =>
    options.UseInMemoryDatabase("JobTrackingDB"));

// Services
builder.Services.AddScoped<UserService>();

var app = builder.Build();

app.UseStaticFiles();
app.UseRouting();

app.MapRazorPages();
app.MapControllers();
app.MapFallbackToFile("index.html");

app.Run();