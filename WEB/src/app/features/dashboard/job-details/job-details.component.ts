import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';
import { JobService } from '../../../core/services/job.service';
import { ApplicationService } from '../../../core/services/application.service';
import { JobPosting } from '../../../core/models/job.models';

@Component({
  selector: 'app-job-details',
  standalone: true,
  imports: [CommonModule, RouterLink, NavbarComponent],
  template: `
    <app-navbar></app-navbar>
    
    <div class="container py-8">
      <div class="mb-6">
        <a routerLink="/dashboard" class="text-blue-600 hover:text-blue-800 text-sm">
          ← Back to Dashboard
        </a>
      </div>

      <div *ngIf="loading" class="text-center py-8">
        <div class="spinner mx-auto"></div>
        <p class="mt-2 text-gray-600">Loading job details...</p>
      </div>

      <div *ngIf="error" class="alert alert-error">
        {{ error }}
      </div>

      <div *ngIf="job && !loading" class="max-w-4xl mx-auto">
        <div class="card">
          <div class="card-header">
            <div class="flex justify-between items-start">
              <div>
                <h1 class="text-2xl font-bold text-gray-900 mb-2">{{ job.title }}</h1>
                <p class="text-lg text-blue-600 font-medium">{{ job.company }}</p>
              </div>
              <span *ngIf="job.hasApplied" class="badge badge-success">Applied</span>
            </div>
          </div>
          
          <div class="card-body">
            <div class="mb-6">
              <h3 class="text-lg font-semibold text-gray-900 mb-3">Job Description</h3>
              <div class="prose prose-sm max-w-none">
                <p class="text-gray-700 whitespace-pre-line">{{ job.description }}</p>
              </div>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <h4 class="font-medium text-gray-900 mb-2">Job Information</h4>
                <div class="space-y-2 text-sm">
                  <div class="flex justify-between">
                    <span class="text-gray-600">Status:</span>
                    <span class="badge badge-success">{{ job.status }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-gray-600">Posted:</span>
                    <span>{{ job.datePosted | date:'medium' }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-gray-600">Applications:</span>
                    <span>{{ job.applicationCount }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div class="card-footer">
            <div class="flex gap-4">
              <button 
                *ngIf="!job.hasApplied"
                (click)="applyToJob()"
                [disabled]="applying"
                class="btn btn-primary">
                <span *ngIf="applying" class="spinner"></span>
                {{ applying ? 'Submitting Application...' : 'Apply for this Job' }}
              </button>
              
              <div *ngIf="job.hasApplied" class="flex items-center text-green-600">
                <span class="text-sm font-medium">✓ Application submitted successfully!</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class JobDetailsComponent implements OnInit {
  job: JobPosting | null = null;
  loading = true;
  error = '';
  applying = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private jobService: JobService,
    private applicationService: ApplicationService
  ) {}

  ngOnInit(): void {
    const jobId = Number(this.route.snapshot.paramMap.get('id'));
    if (jobId) {
      this.loadJob(jobId);
    } else {
      this.router.navigate(['/dashboard']);
    }
  }

  loadJob(id: number): void {
    this.loading = true;
    this.error = '';
    
    this.jobService.getJob(id).subscribe({
      next: (job) => {
        this.job = job;
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Failed to load job details';
        this.loading = false;
      }
    });
  }

  applyToJob(): void {
    if (!this.job) return;
    
    this.applying = true;
    
    this.applicationService.createApplication(this.job.id).subscribe({
      next: (application) => {
        if (this.job) {
          this.job.hasApplied = true;
          this.job.applicationCount++;
        }
        this.applying = false;
      },
      error: (error) => {
        this.error = error.error?.message || 'Failed to submit application';
        this.applying = false;
      }
    });
  }
}