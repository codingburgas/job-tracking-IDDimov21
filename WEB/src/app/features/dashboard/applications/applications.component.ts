import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';
import { ApplicationService } from '../../../core/services/application.service';
import { Application, ApplicationStatus } from '../../../core/models/application.models';

@Component({
  selector: 'app-applications',
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

      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900 mb-2">My Applications</h1>
        <p class="text-gray-600">Track the status of your job applications</p>
      </div>

      <div *ngIf="loading" class="text-center py-8">
        <div class="spinner mx-auto"></div>
        <p class="mt-2 text-gray-600">Loading applications...</p>
      </div>

      <div *ngIf="error" class="alert alert-error">
        {{ error }}
      </div>

      <div *ngIf="!loading && applications.length === 0" class="text-center py-12">
        <p class="text-gray-500 text-lg">You haven't submitted any applications yet.</p>
        <a routerLink="/dashboard" class="btn btn-primary mt-4">Browse Jobs</a>
      </div>

      <div class="grid gap-6">
        <div *ngFor="let application of applications" class="card">
          <div class="card-body">
            <div class="flex justify-between items-start mb-4">
              <div>
                <h3 class="text-lg font-semibold text-gray-900">{{ application.jobTitle }}</h3>
                <p class="text-blue-600 font-medium">{{ application.company }}</p>
              </div>
              <span [class]="getStatusBadgeClass(application.status)" class="badge">
                {{ getStatusText(application.status) }}
              </span>
            </div>
            
            <div class="text-sm text-gray-600">
              <p>Applied on: {{ application.submittedAt | date:'medium' }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class ApplicationsComponent implements OnInit {
  applications: Application[] = [];
  loading = true;
  error = '';

  constructor(private applicationService: ApplicationService) {}

  ngOnInit(): void {
    this.loadApplications();
  }

  loadApplications(): void {
    this.loading = true;
    this.error = '';
    
    this.applicationService.getApplications().subscribe({
      next: (applications) => {
        this.applications = applications.sort((a, b) => 
          new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
        );
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Failed to load applications';
        this.loading = false;
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