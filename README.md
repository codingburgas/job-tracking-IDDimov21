# JobFindan - Job Search and Application System

A full-stack job portal application built with Angular frontend and ASP.NET Core backend, featuring modern UI design and comprehensive functionality for both job seekers and administrators.

## Features

### For Users (Job Seekers)
- **Account Management**: Register and login to personal accounts
- **Job Search**: Browse and search through active job postings with filters
- **Job Applications**: Apply to jobs with one-click application system
- **Application Tracking**: View and track status of submitted applications
- **Modern UI**: Clean, responsive design inspired by leading job portals

### For Administrators
- **Job Management**: Create, edit, and delete job postings
- **Application Management**: View and manage all job applications
- **Status Updates**: Update application statuses (Submitted, Selected for Interview, Rejected)
- **Admin Dashboard**: Comprehensive overview of jobs and applications

## Technology Stack

### Backend (API)
- **ASP.NET Core 8.0** - Web API framework
- **Entity Framework Core** - ORM with SQLite database
- **JWT Authentication** - Secure user authentication
- **BCrypt** - Password hashing
- **Swagger** - API documentation

### Frontend (WEB)
- **Angular 17** - Modern web framework
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **Reactive Forms** - Form handling and validation
- **RxJS** - Reactive programming

## Project Structure

```
JobFindan/
├── API/
│   └── JobFindan.API/
│       ├── Controllers/          # API controllers
│       ├── Models/              # Data models
│       ├── DTOs/                # Data transfer objects
│       ├── Services/            # Business logic services
│       ├── Data/                # Database context and seeding
│       └── Program.cs           # Application startup
├── WEB/
│   └── src/
│       ├── app/
│       │   ├── components/      # Reusable components
│       │   ├── pages/           # Page components
│       │   ├── services/        # API services
│       │   ├── models/          # TypeScript models
│       │   ├── guards/          # Route guards
│       │   └── interceptors/    # HTTP interceptors
│       └── environments/        # Environment configurations
└── JobFindan.sln               # Visual Studio solution file
```

## Getting Started

### Prerequisites
- .NET 8.0 SDK
- Node.js (v18 or higher)
- Visual Studio or JetBrains Rider

### Setup Instructions

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd JobPortal
   ```

2. **Backend Setup**
   ```bash
   cd API/JobFindan.API
   dotnet restore
   dotnet run
   ```
   The API will be available at `https://localhost:7001`

3. **Frontend Setup**
   ```bash
   cd WEB
   npm install
   npm start
   ```
   The Angular app will be available at `http://localhost:4200`

### Default Admin Account
- **Username**: admin
- **Password**: admin123

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login

### Jobs
- `GET /api/jobs` - Get all jobs (with search and filters)
- `GET /api/jobs/{id}` - Get job by ID
- `POST /api/jobs` - Create job (Admin only)
- `PUT /api/jobs/{id}` - Update job (Admin only)
- `DELETE /api/jobs/{id}` - Delete job (Admin only)

### Applications
- `POST /api/applications/submit/{jobId}` - Submit application
- `GET /api/applications/my-applications` - Get user's applications
- `GET /api/applications` - Get all applications (Admin only)
- `PUT /api/applications/{id}/status` - Update application status (Admin only)

## Features in Detail

### User Authentication & Authorization
- JWT-based authentication with role-based access control
- Secure password hashing using BCrypt
- Protected routes and API endpoints based on user roles

### Job Management
- Create, read, update, and delete job postings
- Rich job information including title, company, description, salary, type, location
- Job status management (Active/Inactive)
- Search and filtering capabilities

### Application System
- One-click job application for users
- Prevents duplicate applications to the same job
- Application status tracking and management
- Admin interface for managing all applications

### Modern UI/UX
- Responsive design that works on all devices
- Clean, professional interface inspired by leading job portals
- Intuitive navigation and user experience
- Modern color scheme with orange/gradient theme

## Database Schema

### Users
- User profiles with authentication credentials
- Role-based access (User/Admin)
- Personal information storage

### JobPostings
- Comprehensive job information
- Company details and requirements
- Status management

### Applications
- Links users to job postings
- Application status tracking
- Submission and update timestamps

## Security Features
- Password hashing and salting
- JWT token-based authentication
- Role-based authorization
- CORS configuration for secure cross-origin requests
- Input validation and sanitization

## Development Notes
- Clean architecture with separation of concerns
- Repository pattern with Entity Framework
- Reactive programming with RxJS in Angular
- Comprehensive error handling and validation
- Modern development practices and patterns

## Contributing
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License
This project is licensed under the MIT License.