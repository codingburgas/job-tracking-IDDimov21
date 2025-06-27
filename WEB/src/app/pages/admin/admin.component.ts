import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { JobService } from '../../services/job.service';
import { ApplicationService } from '../../services/application.service';
import { JobPosting, CreateJobRequest, UpdateJobRequest, JobStatus } from '../../models/job.model';
import { Application, ApplicationStatus } from '../../models/application.model';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900">Admin Panel</h1>
        <p class="mt-2 text-gray-600">Manage job postings and applications</p>
      </div>

      <!-- Tabs -->
      <div class="border-b border-gray-200 mb-8">
        <nav class="-mb-px flex space-x-8">
          <button
            (click)="activeTab = 'jobs'"
            [class]="activeTab === 'jobs' ? 'border-orange-500 text-orange-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'"
            class="whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm"
          >
            Job Postings ({{ jobs.length }})
          </button>
          <button
            (click)="activeTab = 'applications'"
            [class]="activeTab === 'applications' ? 'border-orange-500 text-orange-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'"
            class="whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm"
          >
            Applications ({{ applications.length }})
          </button>
        </nav>
      </div>

      <!-- Job Postings Tab -->
      <div *ngIf="activeTab === 'jobs'">
        <!-- Create Job Button -->
        <div class="mb-6">
          <button
            (click)="showCreateJobForm = !showCreateJobForm"
            class="btn btn-primary"
          >
            {{ showCreateJobForm ? 'Cancel' : 'Create New Job' }}
          </button>
        </div>

        <!-- Create Job Form -->
        <div *ngIf="showCreateJobForm" class="card mb-8">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Create New Job Posting</h3>
          <form [formGroup]="jobForm" (ngSubmit)="onSubmitJob()">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Job Title</label>
                <input formControlName="title" type="text" class="form-input" placeholder="e.g. Software Engineer">
                <div *ngIf="jobForm.get('title')?.invalid && jobForm.get('title')?.touched" class="mt-1 text-sm text-red-600">
                  Job title is required
                </div>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
                <input formControlName="companyName" type="text" class="form-input" placeholder="e.g. Google">
                <div *ngIf="jobForm.get('companyName')?.invalid && jobForm.get('companyName')?.touched" class="mt-1 text-sm text-red-600">
                  Company name is required
                </div>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Job Type</label>
                <select formControlName="jobType" class="form-input">
                  <option value="">Select job type</option>
                  <option value="Full-time">Full-time</option>
                  <option value="Part-time">Part-time</option>
                  <option value="Contract">Contract</option>
                  <option value="Internship">Internship</option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Location</label>
                <input formControlName="location" type="text" class="form-input" placeholder="e.g. San Francisco, CA">
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Salary Range</label>
                <input formControlName="salaryRange" type="text" class="form-input" placeholder="e.g. $80,000 - $120,000">
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Experience Level</label>
                <select formControlName="experienceLevel" class="form-input">
                  <option value="">Select experience level</option>
                  <option value="Entry Level">Entry Level</option>
                  <option value="Mid-Level">Mid-Level</option>
                  <option value="Senior Level">Senior Level</option>
                  <option value="Executive">Executive</option>
                </select>
              </div>
            </div>
            <div class="mt-6">
              <label class="block text-sm font-medium text-gray-700 mb-1">Job Description</label>
              <textarea formControlName="description" rows="4" class="form-input" placeholder="Describe the job responsibilities, requirements, and qualifications..."></textarea>
              <div *ngIf="jobForm.get('description')?.invalid && jobForm.get('description')?.touched" class="mt-1 text-sm text-red-600">
                Job description is required
              </div>
            </div>
            <div class="mt-6 flex space-x-4">
              <button type="submit" [disabled]="jobForm.invalid || submittingJob" class="btn btn-primary">
                {{ submittingJob ? 'Creating...' : (editingJob ? 'Update Job' : 'Create Job') }}
              </button>
              <button type="button" (click)="cancelJobForm()" class="btn btn-secondary">
                Cancel
              </button>
            </div>
          </form>
        </div>

        <!-- Jobs List -->
        <div class="space-y-4">
          <div *ngFor="let job of jobs" class="card">
            <div class="flex items-start justify-between">
              <div class="flex-1">
                <div class="flex items-center space-x-3 mb-2">
                  <h3 class="text-lg font-semibold text-gray-900">{{ job.title }}</h3>
                  <span 
                    class="px-2 py-1 rounded-full text-xs font-medium"
                    [ngClass]="job.status === 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'"
                  >
                    {{ job.status === 0 ? 'Active' : 'Inactive' }}
                  </span>
                </div>
                <p class="text-orange-600 font-medium mb-2">{{ job.companyName }} • {{ job.location }}</p>
                <p class="text-gray-600 text-sm mb-3">{{ job.description }}</p>
                <div class="flex items-center space-x-4 text-sm text-gray-500">
                  <span>{{ job.applicationsCount }} applications</span>
                  <span>Posted {{ formatDate(job.datePosted) }}</span>
                  <span>{{ job.jobType }}</span>
                  <span>{{ job.salaryRange }}</span>
                </div>
              </div>
              <div class="flex items-center space-x-2">
                <button (click)="editJob(job)" class="btn btn-secondary text-sm">
                  Edit
                </button>
                <button (click)="deleteJob(job.id)" class="btn bg-red-500 text-white hover:bg-red-600 text-sm">
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Applications Tab -->
      <div *ngIf="activeTab === 'applications'">
        <div class="space-y-4">
          <div *ngFor="let application of applications" class="card">
            <div class="flex items-start justify-between">
              <div class="flex-1">
                <div class="flex items-center space-x-3 mb-2">
                  <h3 class="text-lg font-semibold text-gray-900">{{ application.jobTitle }}</h3>
                  <span 
                    class="px-3 py-1 rounded-full text-sm font-medium"
                    [ngClass]="getStatusClass(application.status)"
                  >
                    {{ getStatusText(application.status) }}
                  </span>
                </div>
                <p class="text-orange-600 font-medium mb-2">{{ application.companyName }}</p>
                <div class="flex items-center space-x-4 text-sm text-gray-500">
                  <span><strong>Applicant:</strong> {{ application.userName }}</span>
                  <span>Applied {{ formatDate(application.submittedAt) }}</span>
                  <span *ngIf="application.updatedAt">Updated {{ formatDate(application.updatedAt) }}</span>
                </div>
              </div>
              <div class="flex items-center space-x-2">
                <select 
                  [value]="application.status" 
                  (change)="updateApplicationStatus(application.id, +$any($event.target).value)"
                  class="form-input text-sm"
                >
                  <option [value]="0">Submitted</option>
                  <option [value]="1">Selected for Interview</option>
                  <option [value]="2">Rejected</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Loading States -->
      <div *ngIf="loading" class="text-center py-8">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto"></div>
        <p class="mt-2 text-gray-500">Loading...</p>
      </div>
    </div>
  `
})
export class AdminComponent implements OnInit {
  activeTab = 'jobs';
  jobs: JobPosting[] = [];
  applications: Application[] = [];
  loading = false;
  showCreateJobForm = false;
  editingJob: JobPosting | null = null;
  submittingJob = false;

  jobForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private jobService: JobService,
    private applicationService: ApplicationService
  ) {
    this.jobForm = this.fb.group({
      title: ['', Validators.required],
      companyName: ['', Validators.required],
      description: ['', Validators.required],
      jobType: [''],
      location: [''],
      salaryRange: [''],
      experienceLevel: ['']
    });
  }

  ngOnInit(): void {
    this.loadJobs();
    this.loadApplications();
  }

  loadJobs(): void {
    this.loading = true;
    this.jobService.getJobs().subscribe({
      next: (jobs) => {
        this.jobs = jobs;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading jobs:', error);
        this.loading = false;
      }
    });
  }

  loadApplications(): void {
    this.loading = true;
    this.applicationService.getAllApplications().subscribe({
      next: (applications) => {
        this.applications = applications;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading applications:', error);
        this.loading = false;
      }
    });
  }

  onSubmitJob(): void {
    if (this.jobForm.valid) {
      this.submittingJob = true;
      
      const jobData = this.jobForm.value;
      
      if (this.editingJob) {
        // Update existing job
        const updateData: UpdateJobRequest = {
          ...jobData,
          status: this.editingJob.status
        };
        
        this.jobService.updateJob(this.editingJob.id, updateData).subscribe({
          next: () => {
            this.submittingJob = false;
            this.cancelJobForm();
            this.loadJobs();
          },
          error: (error) => {
            console.error('Error updating job:', error);
            this.submittingJob = false;
          }
        });
      } else {
        // Create new job
        this.jobService.createJob(jobData).subscribe({
          next: () => {
            this.submittingJob = false;
            this.cancelJobForm();
            this.loadJobs();
          },
          error: (error) => {
            console.error('Error creating job:', error);
            this.submittingJob = false;
          }
        });
      }
    }
  }

  editJob(job: JobPosting): void {
    this.editingJob = job;
    this.showCreateJobForm = true;
    this.jobForm.patchValue({
      title: job.title,
      companyName: job.companyName,
      description: job.description,
      jobType: job.jobType,
      location: job.location,
      salaryRange: job.salaryRange,
      experienceLevel: job.experienceLevel
    });
  }

  deleteJob(jobId: number): void {
    if (confirm('Are you sure you want to delete this job posting?')) {
      this.jobService.deleteJob(jobId).subscribe({
        next: () => {
          this.loadJobs();
        },
        error: (error) => {
          console.error('Error deleting job:', error);
        }
      });
    }
  }

  cancelJobForm(): void {
    this.showCreateJobForm = false;
    this.editingJob = null;
    this.jobForm.reset();
  }

  updateApplicationStatus(applicationId: number, status: ApplicationStatus): void {
    this.applicationService.updateApplicationStatus(applicationId, { status }).subscribe({
      next: () => {
        this.loadApplications();
      },
      error: (error) => {
        console.error('Error updating application status:', error);
      }
    });
  }

  getStatusText(status: ApplicationStatus): string {
    switch (status) {
      case ApplicationStatus.Submitted:
        return 'Submitted';
      case ApplicationStatus.SelectedForInterview:
        return 'Selected for Interview';
      case ApplicationStatus.Rejected:
        return 'Rejected';
      default:
        return 'Unknown';
    }
  }

  getStatusClass(status: ApplicationStatus): string {
    switch (status) {
      case ApplicationStatus.Submitted:
        return 'bg-blue-100 text-blue-800';
      case ApplicationStatus.SelectedForInterview:
        return 'bg-green-100 text-green-800';
      case ApplicationStatus.Rejected:
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }
}