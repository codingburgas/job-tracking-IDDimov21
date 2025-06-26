import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';
import { JobService } from '../../../core/services/job.service';
import { ApplicationService } from '../../../core/services/application.service';
import { JobPosting, JobStatus } from '../../../core/models/job.models';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, NavbarComponent],
  template: `
    <app-navbar></app-navbar>
    
    <div class="container py-8">
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
        <p class="text-gray-600">Manage job postings and applications</p>
      </div>

      <div class="flex justify-between items-center mb-6">
        <h2 class="text-xl font-semibold text-gray-800">Job Postings</h2>
        <a routerLink="/admin/jobs/new" class="btn btn-primary">
          Create New Job
        </a>
      </div>

      <div *ngIf="loading" class="text-center py-8">
        <div class="spinner mx-auto"></div>
        <p class="mt-2 text-gray-600">Loading jobs...</p>
      </div>

      <div *ngIf="error" class="alert alert-error">
        {{ error }}
      </div>

      <div *ngIf="!loading && jobs.length === 0" class="text-center py-12">
        <p class="text-gray-500 text-lg">No jobs created yet.</p>
        <a routerLink="/admin/jobs/new" class="btn btn-primary mt-4">Create Your First Job</a>
      </div>

      <div class="grid gap-6">
        <div *ngFor="let job of jobs" class="card">
          <div class="card-body">
            <div class="flex justify-between items-start mb-4">
              <div class="flex-1">
                <h3 class="text-lg font-semibold text-gray-900">{{ job.title }}</h3>
                <p class="text-blue-600 font-medium">{{ job.company }}</p>
                <p class="text-gray-600 text-sm mt-2 line-clamp-2">{{ job.description }}</p>
              </div>
              <div class="flex flex-col items-end gap-2">
                <span [class]="getStatusBadgeClass(job.status)" class="badge">
                  {{ job.status }}
                </span>
                <span class="text-xs text-gray-500">
                  {{ job.applicationCount }} applications
                </span>
              </div>
            </div>
            
            <div class="flex justify-between items-center text-xs text-gray-500 mb-4">
              <span>Posted: {{ job.datePosted | date:'short' }}</span>
            </div>
            
            <div class="flex gap-2">
              <a [routerLink]="['/admin/jobs', job.id, 'applications']" class="btn btn-secondary btn-sm">
                View Applications ({{ job.applicationCount }})
              </a>
              <a [routerLink]="['/admin/jobs', job.id, 'edit']" class="btn btn-secondary btn-sm">
                Edit
              </a>
              <button 
                (click)="deleteJob(job.id, job.title)"
                [disabled]="deletingId === job.id"
                class="btn btn-danger btn-sm">
                <span *ngIf="deletingId === job.id" class="spinner"></span>
                {{ deletingId === job.id ? 'Deleting...' : 'Delete' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .line-clamp-2 {
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
  `]
})
export class AdminDashboardComponent implements OnInit {
  jobs: JobPosting[] = [];
  loading = true;
  error = '';
  deletingId: number | null = null;

  constructor(
    private jobService: JobService,
    private applicationService: ApplicationService
  ) {}

  ngOnInit(): void {
    this.loadJobs();
  }

  loadJobs(): void {
    this.loading = true;
    this.error = '';
    
    this.jobService.getJobs().subscribe({
      next: (jobs) => {
        this.jobs = jobs;
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Failed to load jobs';
        this.loading = false;
      }
    });
  }

  deleteJob(jobId: number, jobTitle: string): void {
    if (confirm(`Are you sure you want to delete "${jobTitle}"? This action cannot be undone.`)) {
      this.deletingId = jobId;
      
      this.jobService.deleteJob(jobId).subscribe({
        next: () => {
          this.jobs = this.jobs.filter(j => j.id !== jobId);
          this.deletingId = null;
        },
        error: (error) => {
          this.error = 'Failed to delete job';
          this.deletingId = null;
        }
      });
    }
  }

  getStatusBadgeClass(status: JobStatus): string {
    return status === JobStatus.Active ? 'badge-success' : 'badge-warning';
  }
}