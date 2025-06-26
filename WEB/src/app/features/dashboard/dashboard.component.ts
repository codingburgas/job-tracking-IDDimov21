import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';
import { JobService } from '../../core/services/job.service';
import { ApplicationService } from '../../core/services/application.service';
import { JobPosting } from '../../core/models/job.models';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, NavbarComponent],
  template: `
    <app-navbar></app-navbar>
    
    <div class="container py-8">
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900 mb-2">Job Dashboard</h1>
        <p class="text-gray-600">Find and apply to the latest job opportunities</p>
      </div>

      <div class="flex justify-between items-center mb-6">
        <h2 class="text-xl font-semibold text-gray-800">Available Jobs</h2>
        <a routerLink="/dashboard/applications" class="btn btn-secondary">
          View My Applications
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
        <p class="text-gray-500 text-lg">No jobs available at the moment.</p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div *ngFor="let job of jobs" class="card">
          <div class="card-body">
            <div class="flex justify-between items-start mb-3">
              <h3 class="text-lg font-semibold text-gray-900">{{ job.title }}</h3>
              <span *ngIf="job.hasApplied" class="badge badge-success">Applied</span>
            </div>
            
            <p class="text-blue-600 font-medium mb-2">{{ job.company }}</p>
            <p class="text-gray-600 text-sm mb-4 line-clamp-3">{{ job.description }}</p>
            
            <div class="flex justify-between items-center text-xs text-gray-500 mb-4">
              <span>Posted: {{ job.datePosted | date:'short' }}</span>
              <span>{{ job.applicationCount }} applications</span>
            </div>
            
            <div class="flex gap-2">
              <a [routerLink]="['/dashboard/jobs', job.id]" class="btn btn-secondary btn-sm flex-1">
                View Details
              </a>
              <button 
                *ngIf="!job.hasApplied"
                (click)="applyToJob(job.id)"
                [disabled]="applyingTo === job.id"
                class="btn btn-primary btn-sm flex-1">
                <span *ngIf="applyingTo === job.id" class="spinner"></span>
                {{ applyingTo === job.id ? 'Applying...' : 'Apply Now' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .line-clamp-3 {
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
  `]
})
export class DashboardComponent implements OnInit {
  jobs: JobPosting[] = [];
  loading = true;
  error = '';
  applyingTo: number | null = null;

  constructor(
    private jobService: JobService,
    private applicationService: ApplicationService,
    private router: Router
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

  applyToJob(jobId: number): void {
    this.applyingTo = jobId;
    
    this.applicationService.createApplication(jobId).subscribe({
      next: (application) => {
        // Update the job to show it's been applied to
        const job = this.jobs.find(j => j.id === jobId);
        if (job) {
          job.hasApplied = true;
          job.applicationCount++;
        }
        this.applyingTo = null;
      },
      error: (error) => {
        this.error = error.error?.message || 'Failed to submit application';
        this.applyingTo = null;
      }
    });
  }
}