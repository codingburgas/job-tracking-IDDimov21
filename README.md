# 🎯 JobFindan – Job Search & Application Platform

A modern, full-stack **job portal application** built with **Angular** and **ASP.NET Core**, designed for job seekers and administrators. It features a clean UI, intuitive UX, and robust functionalities inspired by leading job platforms.

---

## 🚀 Features

### 👤 For Job Seekers
- 🔐 Account Management – Register/login securely  
- 🔎 Job Search – Browse and filter job listings  
- 📩 Apply Easily – One-click job application system  
- 📊 Application Tracking – View application statuses  
- 🎨 Modern UI – Responsive, sleek, and intuitive design  

### 🛠️ For Administrators
- 📝 Job Management – Create, edit, delete job listings  
- 📁 Application Review – View and manage all applications  
- 🔄 Status Updates – Update application statuses  
- 📊 Dashboard – Visual overview of jobs & applicants  

---

## 🧰 Tech Stack

### 🔙 Backend
- **ASP.NET Core 8.0** – API framework  
- **Entity Framework Core** – ORM + SQLite  
- **JWT Auth + BCrypt** – Secure login & password hashing  
- **Swagger** – Auto-generated API docs  

### 🌐 Frontend
- **Angular 17** – Component-based frontend framework  
- **Tailwind CSS** – Utility-first CSS  
- **TypeScript** – Strictly typed JavaScript  
- **RxJS** – Reactive programming  
- **Reactive Forms** – Robust form handling  

---

## 📁 Project Structure
```
JobFindan/
├── API/
│ └── JobFindan.API/
│ ├── Controllers/ # API endpoints
│ ├── Models/ # Data models
│ ├── DTOs/ # Transfer objects
│ ├── Services/ # Business logic
│ ├── Data/ # DB context/seeding
│ └── Program.cs # App startup
├── WEB/
│ └── src/
│ ├── app/
│ │ ├── components/ # UI components
│ │ ├── pages/ # Main pages
│ │ ├── services/ # API integration
│ │ ├── models/ # TypeScript interfaces
│ │ ├── guards/ # Route protection
│ │ └── interceptors/ # HTTP middleware
│ └── environments/ # Env configs
└── JobFindan.sln # Solution file
```
---

## ⚙️ Getting Started

### ✅ Prerequisites
- [.NET 8.0 SDK](https://dotnet.microsoft.com/en-us/download)
- [Node.js v18+](https://nodejs.org/)
- Visual Studio / JetBrains Rider

---

### 📦 Installation & Setup

#### 1️⃣ Clone the Repo
git clone <repository-url>
cd JobFindan
2️⃣ Run the Backend
cd API/JobFindan.API
dotnet restore
dotnet run
➡️ API will run at https://localhost:7001

3️⃣ Run the Frontend
cd WEB
npm install
npm start
➡️ Frontend will run at http://localhost:4200

🔐 Default Admin Account
Username: admin

Password: admin123

🌐 API Overview
🔑 Authentication
Method	Endpoint	Description
POST	/api/auth/register	Register user
POST	/api/auth/login	Login user

📄 Job Management
Method	Endpoint	Description
GET	/api/jobs	List all jobs
GET	/api/jobs/{id}	Job details by ID
POST	/api/jobs	Create job (Admin only)
PUT	/api/jobs/{id}	Edit job (Admin only)
DELETE	/api/jobs/{id}	Delete job (Admin only)

📨 Applications
Method	Endpoint	Description
POST	/api/applications/submit/{jobId}	Submit application
GET	/api/applications/my-applications	User's applications
GET	/api/applications	View all applications (Admin only)
PUT	/api/applications/{id}/status	Update status (Admin only)

📌 Key Features (In Detail)
🔐 Authentication & Security
JWT + BCrypt for secure login

Role-based access (User/Admin)

Route protection via Angular guards

Secure CORS and input validation

🧾 Job Listings
CRUD job management

Filters by location, type, title

Job status control (Active/Inactive)

📬 Applications
One-click apply

Duplicate submission prevention

Real-time status tracking (Submitted, Interview, Rejected)

💻 UI/UX Design
Fully responsive (desktop/mobile/tablet)

Gradient + orange theme

Clean layout and intuitive navigation

🗃️ Database Schema
👤 Users
Username, email, hashed password

Role: User or Admin

💼 JobPostings
Title, description, company, location, type, salary

Active/Inactive status

📄 Applications
Linked user and job IDs

Status tracking (with timestamps)

🛡️ Security Highlights
🔐 Hashed passwords (BCrypt)

🔑 JWT-based session auth

🔒 Role-based route/API protection

🧼 Sanitized inputs and CORS-configured
