# Job Search & Application System

A comprehensive web application for job searching and application management with separate interfaces for job seekers and administrators.

## Features

### For Users (Job Seekers)
- User registration and authentication
- Browse active job postings
- Apply to jobs with one-click application
- Track application status (Submitted, Selected for Interview, Rejected)
- View application history
- Responsive design for all devices

### For Administrators
- Pre-configured admin account (username: `admin`, password: `admin123`)
- Create, edit, and delete job postings
- Manage job status (Active/Inactive)
- View all applications for each job
- Update application status
- Comprehensive dashboard for job management

## Technology Stack

### Backend (API)
- **Framework**: ASP.NET Core 8.0 Web API
- **Database**: SQLite with Entity Framework Core
- **Authentication**: JWT Bearer tokens
- **Password Hashing**: BCrypt
- **Architecture**: Clean architecture with services, DTOs, and controllers

### Frontend (WEB)
- **Framework**: Angular 18
- **Styling**: Custom CSS with modern design system
- **State Management**: RxJS Observables
- **Routing**: Angular Router with lazy loading
- **Authentication**: JWT interceptors and guards
- **Forms**: Reactive forms with validation

## Getting Started

### Prerequisites
- .NET 8.0 SDK
- Node.js (v18 or higher)
- Angular CLI

### Running the Application

#### Backend API
1. Navigate to the API directory:
   ```bash
   cd API
   ```

2. Restore dependencies and run:
   ```bash
   dotnet restore
   dotnet run
   ```
   
   The API will be available at `http://localhost:5000`

#### Frontend Web Application
1. Navigate to the WEB directory:
   ```bash
   cd WEB
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```
   
   The web application will be available at `http://localhost:4200`

### Default Admin Account
- **Username**: `admin`
- **Password**: `admin123`

## Project Structure

```
├── API/                          # Backend Web API
│   └── JobSearchSystem.API/
│       ├── Controllers/          # API Controllers
│       ├── Services/            # Business logic services
│       ├── Models/              # Entity models
│       ├── DTOs/                # Data transfer objects
│       ├── Data/                # Database context
│       └── Program.cs           # Application entry point
│
└── WEB/                         # Frontend Angular Application
    ├── src/
    │   ├── app/
    │   │   ├── core/            # Core services, guards, interceptors
    │   │   ├── features/        # Feature modules (auth, dashboard, admin)
    │   │   ├── shared/          # Shared components
    │   │   └── app.component.ts # Root component
    │   ├── environments/        # Environment configurations
    │   └── styles.css          # Global styles
    └── package.json
```

## Key Features Implementation

### Security
- JWT-based authentication
- Role-based access control (USER/ADMIN)
- Password hashing with BCrypt
- CORS configuration for cross-origin requests

### Database Design
- Users table with role-based access
- Job postings with status management
- Applications with unique constraints (one application per user per job)
- Foreign key relationships with cascading deletes

### User Experience
- Modern, responsive design
- Intuitive navigation with role-based menus
- Real-time status updates
- Form validation with error messaging
- Loading states and error handling

### Business Logic
- Users can only apply once per job
- Only active jobs accept applications
- Administrators cannot submit applications
- Application status workflow management

## Development

The application uses a clean architecture approach with:
- Separation of concerns between frontend and backend
- Service-based business logic
- DTO pattern for API communication
- Reactive programming with RxJS
- Component-based UI architecture

Both the API and Web projects are structured for maintainability and scalability, with proper error handling, validation, and user feedback throughout the application.