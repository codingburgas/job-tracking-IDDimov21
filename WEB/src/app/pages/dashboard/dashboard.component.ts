import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { JobService } from '../../services/job.service';
import { ApplicationService } from '../../services/application.service';
import { AuthService } from '../../services/auth.service';
import { JobPosting } from '../../models/job.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="min-h-screen bg-gray-50">
      <!-- Hero Section -->
      <div class="gradient-bg hero-pattern">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div class="text-center">
            <h1 class="text-4xl md:text-5xl font-bold text-white mb-4" style="color:black">
              The Right Job is Waiting for You
            </h1>
            <p class="text-xl text-orange-100 mb-8" style="color:orange">
              Explore thousands of jobs and take the next step in your career today!
            </p>
            
            <!-- Search Bar -->
            <div class="max-w-2xl mx-auto">
              <form [formGroup]="searchForm" (ngSubmit)="onSearch()" class="flex rounded-lg overflow-hidden shadow-lg">
                <input
                  formControlName="search"
                  type="text"
                  placeholder="Search here..."
                  class="flex-1 px-6 py-4 text-gray-700 focus:outline-none"
                />
                <button
                  type="submit"
                  class="bg-orange-600 hover:bg-orange-700 text-white px-8 py-4 font-medium transition-colors"
                >
                  Search Job
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      <!-- Main Content -->
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div class="flex gap-8">
          <!-- Sidebar -->
          <div class="w-1/4">
            <!-- Filter Section -->
            <div class="card mb-6">
              <h3 class="text-lg font-semibold text-gray-900 mb-4">Filter</h3>
              
              <!-- Job Type Filter -->
              <div class="mb-6">
                <h4 class="text-sm font-medium text-gray-700 mb-3">Job Type</h4>
                <div class="space-y-2">
                  <label class="flex items-center">
                    <input type="radio" name="jobType" value="" (change)="onJobTypeChange('')" 
                           [checked]="selectedJobType === ''" class="text-orange-500">
                    <span class="ml-2 text-sm text-gray-600">All Types</span>
                  </label>
                  <label class="flex items-center">
                    <input type="radio" name="jobType" value="Full-time" (change)="onJobTypeChange('Full-time')"
                           [checked]="selectedJobType === 'Full-time'" class="text-orange-500">
                    <span class="ml-2 text-sm text-gray-600">Full-time</span>
                  </label>
                  <label class="flex items-center">
                    <input type="radio" name="jobType" value="Part-time" (change)="onJobTypeChange('Part-time')"
                           [checked]="selectedJobType === 'Part-time'" class="text-orange-500">
                    <span class="ml-2 text-sm text-gray-600">Part-time</span>
                  </label>
                  <label class="flex items-center">
                    <input type="radio" name="jobType" value="Contract" (change)="onJobTypeChange('Contract')"
                           [checked]="selectedJobType === 'Contract'" class="text-orange-500">
                    <span class="ml-2 text-sm text-gray-600">Contract</span>
                  </label>
                  <label class="flex items-center">
                    <input type="radio" name="jobType" value="Internship" (change)="onJobTypeChange('Internship')"
                           [checked]="selectedJobType === 'Internship'" class="text-orange-500">
                    <span class="ml-2 text-sm text-gray-600">Internship</span>
                  </label>
                </div>
              </div>
            </div>

            <!-- Smart Auto-Apply Ad -->
            <div class="bg-gradient-to-br from-orange-400 to-red-500 rounded-xl p-6 text-white">
              <div class="flex items-center mb-2">
                <span class="text-lg">⭐</span>
                <span class="ml-2 font-bold">Easy, Fast and Efficient</span>
              </div>
            </div>
          </div>
		
          <!-- Job Listings -->
          <div class="flex-1">
            <div class="flex justify-between items-center mb-6">
              <h2 class="text-2xl font-bold text-gray-900">
                Explore All Jobs ({{ jobs.length }} Jobs Available)
              </h2>
              <div class="flex items-center space-x-2">
                <span class="text-sm text-gray-500">Sort By</span>
                <select class="form-input py-2 text-sm">
                  <option>Most Recent</option>
                  <option>Most Relevant</option>
                  <option>Salary: High to Low</option>
                </select>
              </div>
            </div>

            <!-- Job Cards -->
            <div class="space-y-4">
              <div *ngFor="let job of jobs" class="card hover:shadow-md transition-shadow">
                <div class="flex items-start justify-between">
                  <div class="flex items-start space-x-4">
                    <!-- Company Logo Placeholder -->
                    <div class="w-12 h-12 bg-gradient-to-br from-orange-400 to-orange-600 rounded-lg flex items-center justify-center flex-shrink-0">
                      <span class="text-white font-bold text-sm">{{ job.companyName.charAt(0) }}</span>
                    </div>
                    
                    <div class="flex-1">
                      <div class="flex items-center space-x-2 mb-1">
                        <h3 class="text-lg font-semibold text-gray-900">{{ job.title }}</h3>
                        <span class="text-sm text-gray-500">{{ getTimeAgo(job.datePosted) }}</span>
                      </div>
                      <p class="text-orange-600 font-medium mb-2">{{ job.companyName }} • {{ job.location }}</p>
                      <p class="text-gray-600 text-sm mb-3 line-clamp-2">{{ job.description }}</p>
                      
                      <div class="flex items-center space-x-4 text-sm">
                        <div class="flex items-center space-x-1">
                          <span class="text-green-600">💰</span>
                          <span class="text-gray-700">{{ job.salaryRange }}</span>
                        </div>
                        <div class="flex items-center space-x-1">
                          <span class="text-blue-600">⏰</span>
                          <span class="text-gray-700">{{ job.jobType }}</span>
                        </div>
                        <div class="flex items-center space-x-1">
                          <span class="text-purple-600">📊</span>
                          <span class="text-gray-700">{{ job.experienceLevel }}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div class="flex items-center space-x-2">
                    <button class="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                      <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"></path>
                      </svg>
                    </button>
                    <button 
                      *ngIf="!authService.isAdmin"
                      (click)="applyToJob(job.id)"
                      [disabled]="applyingToJob === job.id"
                      class="btn bg-orange-500 text-white hover:bg-orange-600 px-6 py-2 rounded-lg flex items-center space-x-2"
                    >
                      <span *ngIf="applyingToJob === job.id">Applying...</span>
                      <span *ngIf="applyingToJob !== job.id">Apply</span>
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- Loading State -->
            <div *ngIf="loading" class="text-center py-8">
              <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto"></div>
              <p class="mt-2 text-gray-500">Loading jobs...</p>
            </div>

            <!-- Empty State -->
            <div *ngIf="!loading && jobs.length === 0" class="text-center py-12">
              <div class="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6.294a2 2 0 01-1.255 1.863l-7.83 3.132a4 4 0 01-2.83 0l-7.83-3.132A2 2 0 013 14.294V8a2 2 0 012-2h14a2 2 0 012 2z"></path>
                </svg>
              </div>
              <h3 class="text-lg font-medium text-gray-900 mb-2">No jobs found</h3>
              <p class="text-gray-500">Try adjusting your search criteria or check back later for new opportunities.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class DashboardComponent implements OnInit {
  searchForm: FormGroup;
  jobs: JobPosting[] = [];
  loading = false;
  selectedJobType = '';
  applyingToJob: number | null = null;

  constructor(
    private fb: FormBuilder,
    private jobService: JobService,
    private applicationService: ApplicationService,
    public authService: AuthService
  ) {
    this.searchForm = this.fb.group({
      search: ['']
    });
  }

  ngOnInit(): void {
    this.loadJobs();
  }

  loadJobs(): void {
    this.loading = true;
    const searchTerm = this.searchForm.get('search')?.value || '';
    
    this.jobService.getJobs(searchTerm, this.selectedJobType || undefined).subscribe({
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

  onSearch(): void {
    this.loadJobs();
  }

  onJobTypeChange(jobType: string): void {
    this.selectedJobType = jobType;
    this.loadJobs();
  }

  applyToJob(jobId: number): void {
    if (this.authService.isAdmin) return;
    
    this.applyingToJob = jobId;
    this.applicationService.submitApplication(jobId).subscribe({
      next: () => {
        this.applyingToJob = null;
        // You could show a success message here
        alert('Application submitted successfully!');
      },
      error: (error) => {
        this.applyingToJob = null;
        alert(error.error?.message || 'Failed to submit application. You may have already applied.');
      }
    });
  }

  getTimeAgo(date: Date): string {
    const now = new Date();
    const postDate = new Date(date);
    const diffTime = Math.abs(now.getTime() - postDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return '1 day ago';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
    return `${Math.ceil(diffDays / 30)} months ago`;
  }
}