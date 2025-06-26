import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';
import { ApplicationService } from '../../../core/services/application.service';
import { JobService } from '../../../core/services/job.service';
import { Application, ApplicationStatus } from '../../../core/models/application.models';
import { JobPosting } from '../../../core/models/job.models';

@Component({
  selector: 'app-job-applications',
  standalone: true,
  imports: [CommonModule, RouterLink, NavbarComponent],
  template: `
    <app-navbar></app-navbar>
    
    <div class="container py-8">
      <div class="mb-6">
        <a routerLink="/admin" class="text-blue-600 hover:text-blue-800 text-sm">
          ← Back to Admin Dashboard
        </a>
      </div>

      <div class="mb-8" *ngIf="job">
        <h1 class="text-3xl font-bold text-gray-900 mb-2">Applications for {{ job.title }}</h1>
        <p class="text-gray-600">{{ job.company }} • {{ applications.length }} applications</p>
      </div>

      <div *ngIf="loading" class="text-center py-8">
        <div class="spinner mx-auto"></div>
        <p class="mt-2 text-gray-600">Loading applications...</p>
      </div>

      <div *ngIf="error" class="alert alert-error">
        {{ error }}
      </div>

      <div *ngIf="!loading && applications.length === 0" class="text-center py-12">
        <p class="text-gray-500 text-lg">No applications received yet for this job.</p>
      </div>

      <div class="grid gap-6">
        <div *ngFor="let application of applications" class="card">
          <div class="card-body">
            <div class="flex justify-between items-start mb-4">
              <div>
                <h3 class="text-lg font-semibold text-gray-900">{{ application.userName }}</h3>
                <p class="text-sm text-gray-600">Applied on: {{ application.submittedAt | date:'medium' }}</p>
              </div>
              <div class="flex items-center gap-4">
                <span [class]="getStatusBadgeClass(application.status)" class="badge">
                  {{ getStatusText(application.status) }}
                </span>
              </div>
            </div>
            
            <div class="flex gap-2">
              <button 
                *ngIf="application.status !== ApplicationStatus.SelectedForInterview"
                (click)="updateStatus(application.id, ApplicationStatus.SelectedForInterview)"
                [disabled]="updatingId === application.id"
                class="btn btn-success btn-sm">
                <span *ngIf="updatingId === application.id" class="spinner"></span>
                Select for Interview
              </button>
              
              <button 
                *ngIf="application.status !== ApplicationStatus.Rejected"
                (click)="updateStatus(application.id, ApplicationStatus.Rejected)"
                [disabled]="updatingId === application.id"
                class="btn btn-danger btn-sm">
                <span *ngIf="updatingId === application.id" class="spinner"></span>
                Reject
              </button>
              
              <button 
                *ngIf="application.status !== ApplicationStatus.Submitted"
                (click)="updateStatus(application.id, ApplicationStatus.Submitted)"
                [disabled]="updatingId === application.id"
                class="btn btn-secondary btn-sm">
                <span *ngIf="updatingId === application.id" class="spinner"></span>
                Reset to Submitted
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class JobApplicationsComponent implements OnInit {
  job: JobPosting | null = null;
  applications: Application[] = [];
  loading = true;
  error = '';
  updatingId: number | null = null;
  ApplicationStatus = ApplicationStatus;

  constructor(
    private route: ActivatedRoute,
    private applicationService: ApplicationService,
    private jobService: JobService
  ) {}

  ngOnInit(): void {
    const jobId = Number(this.route.snapshot.paramMap.get('id'));
    if (jobId) {
      this.loadJobAndApplications(jobId);
    }
  }

  loadJobAndApplications(jobId: number): void {
    this.loading = true;
    this.error = '';
    
    // Load job details and applications in parallel
    Promise.all([
      this.jobService.getJob(jobId).toPromise(),
      this.applicationService.getJobApplications(jobId).toPromise()
    ]).then(([job, applications]) => {
      this.job = job!;
      this.applications = applications!.sort((a, b) => 
        new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
      );
      this.loading = false;
    }).catch(error => {
      this.error = 'Failed to load job applications';
      this.loading = false;
    });
  }

  updateStatus(applicationId: number, status: ApplicationStatus): void {
    this.updatingId = applicationId;
    
    this.applicationService.updateApplicationStatus(applicationId, { status }).subscribe({
      next: (updatedApplication) => {
        const index = this.applications.findIndex(a => a.id === applicationId);
        if (index !== -1) {
          this.applications[index] = updatedApplication;
        }
        this.updatingId = null;
      },
      error: (error) => {
        this.error = 'Failed to update application status';
        this.updatingId = null;
      }
    });
  }

  getStatusBadgeClass(status: ApplicationStatus): string {
    switch (status) {
      case ApplicationStatus.Submitted:
        return 'badge-info';
      case ApplicationStatus.SelectedForInterview:
        return 'badge-success';
      case ApplicationStatus.Rejected:
        return 'badge-danger';
      default:
        return 'badge-info';
    }
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
}