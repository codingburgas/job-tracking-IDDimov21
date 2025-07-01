import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApplicationService } from '../../services/application.service';
import { Application, ApplicationStatus } from '../../models/application.model';

@Component({
  selector: 'app-applications',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900">My Applications</h1>
        <p class="mt-2 text-gray-600">Track the status of your job applications</p>
      </div>

      <!-- Applications List -->
      <div class="space-y-6">
        <div *ngFor="let application of applications" class="card border rounded-lg p-4 shadow-sm bg-white">
          <div class="flex items-start justify-between">
            <div class="flex items-start space-x-4">
              <!-- Company Logo Placeholder -->
              <div class="w-12 h-12 bg-gradient-to-br from-orange-400 to-orange-600 rounded-lg flex items-center justify-center flex-shrink-0">
                <span class="text-white font-bold text-sm">{{ application.companyName.charAt(0) }}</span>
              </div>
              
              <div class="flex-1">
                <h3 class="text-lg font-semibold text-gray-900 mb-1">{{ application.jobTitle }}</h3>
                <p class="text-orange-600 font-medium mb-2">{{ application.companyName }}</p>
                <div class="flex items-center space-x-4 text-sm text-gray-500">
                  <span>Applied on {{ formatDate(application.submittedAt) }}</span>
                  <span *ngIf="application.updatedAt">Updated {{ formatDate(application.updatedAt) }}</span>
                </div>
              </div>
            </div>
            
            <div class="flex flex-col items-end space-y-2">
              <span 
                class="px-3 py-1 rounded-full text-sm font-medium"
                [ngClass]="getStatusClass(application.status)"
              >
                {{ getStatusText(application.status) }}
              </span>

              <!-- Show Delete Button if Rejected -->
              <button
                *ngIf="application.status === ApplicationStatus.Rejected"
                (click)="deleteApplication(application.id)"
                class="text-sm text-red-600 hover:underline mt-1"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div *ngIf="loading" class="text-center py-8">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto"></div>
        <p class="mt-2 text-gray-500">Loading applications...</p>
      </div>

      <!-- Empty State -->
      <div *ngIf="!loading && applications.length === 0" class="text-center py-12">
        <div class="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
          </svg>
        </div>
        <h3 class="text-lg font-medium text-gray-900 mb-2">No applications yet</h3>
        <p class="text-gray-500">Start applying to jobs to see your applications here.</p>
      </div>
    </div>
  `
})
export class ApplicationsComponent implements OnInit {
  applications: Application[] = [];
  loading = false;
  ApplicationStatus = ApplicationStatus; // 👈 To use enum in template

  constructor(private applicationService: ApplicationService) {}

  ngOnInit(): void {
    this.loadApplications();
  }

  loadApplications(): void {
    this.loading = true;
    this.applicationService.getMyApplications().subscribe({
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

  deleteApplication(id: number): void {
    this.applicationService.deleteRejectedApplication(id).subscribe({
      next: () => {
        this.applications = this.applications.filter(app => app.id !== id);
      },
      error: (err: any) => {
        console.error('Failed to delete application:', err);
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
