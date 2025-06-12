using JobTracking.DAL;
using JobTracking.DAL.Models;

namespace JobTracking.BLL.Services;

public class UserService {
    private readonly JobTrackingContext _context;
    public UserService(JobTrackingContext context) => _context = context;

    public User? Authenticate(string username, string password) =>
        _context.Users.FirstOrDefault(u => u.Username == username && u.Password == password);

    public void Register(User user) {
        if (_context.Users.Any(u => u.Username == user.Username))
            throw new Exception("Username already exists.");
        _context.Users.Add(user);
        _context.SaveChanges();
    }
}