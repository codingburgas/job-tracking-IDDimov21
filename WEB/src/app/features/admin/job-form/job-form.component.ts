import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';
import { JobService } from '../../../core/services/job.service';
import { JobPosting, JobStatus } from '../../../core/models/job.models';

@Component({
  selector: 'app-job-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, NavbarComponent],
  template: `
    <app-navbar></app-navbar>
    
    <div class="container py-8">
      <div class="mb-6">
        <a routerLink="/admin" class="text-blue-600 hover:text-blue-800 text-sm">
          ← Back to Admin Dashboard
        </a>
      </div>

      <div class="max-w-2xl mx-auto">
        <div class="mb-8">
          <h1 class="text-3xl font-bold text-gray-900 mb-2">
            {{ isEditMode ? 'Edit Job Posting' : 'Create New Job Posting' }}
          </h1>
          <p class="text-gray-600">
            {{ isEditMode ? 'Update job posting details' : 'Fill in the details to create a new job posting' }}
          </p>
        </div>

        <div *ngIf="loading" class="text-center py-8">
          <div class="spinner mx-auto"></div>
          <p class="mt-2 text-gray-600">Loading...</p>
        </div>

        <form *ngIf="!loading" [formGroup]="jobForm" (ngSubmit)="onSubmit()" class="space-y-6">
          <div *ngIf="error" class="alert alert-error">
            {{ error }}
          </div>
          
          <div class="form-group">
            <label for="title" class="form-label">Job Title</label>
            <input
              id="title"
              formControlName="title"
              type="text"
              class="form-input"
              placeholder="e.g., Software Developer, Marketing Manager"
            />
            <div *ngIf="jobForm.get('title')?.invalid && jobForm.get('title')?.touched" 
                 class="form-error">
              Job title is required
            </div>
          </div>

          <div class="form-group">
            <label for="company" class="form-label">Company Name</label>
            <input
              id="company"
              formControlName="company"
              type="text"
              class="form-input"
              placeholder="e.g., Tech Solutions Inc."
            />
            <div *ngIf="jobForm.get('company')?.invalid && jobForm.get('company')?.touched" 
                 class="form-error">
              Company name is required
            </div>
          </div>

          <div class="form-group">
            <label for="description" class="form-label">Job Description</label>
            <textarea
              id="description"
              formControlName="description"
              class="form-textarea"
              rows="8"
              placeholder="Describe the job responsibilities, requirements, and qualifications..."
            ></textarea>
            <div *ngIf="jobForm.get('description')?.invalid && jobForm.get('description')?.touched" 
                 class="form-error">
              Job description is required
            </div>
          </div>

          <div *ngIf="isEditMode" class="form-group">
            <label for="status" class="form-label">Status</label>
            <select
              id="status"
              formControlName="status"
              class="form-select"
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>

          <div class="flex gap-4">
            <button 
              type="submit" 
              [disabled]="jobForm.invalid || submitting"
              class="btn btn-primary">
              <span *ngIf="submitting" class="spinner"></span>
              {{ submitting ? 'Saving...' : (isEditMode ? 'Update Job' : 'Create Job') }}
            </button>
            
            <a routerLink="/admin" class="btn btn-secondary">
              Cancel
            </a>
          </div>
        </form>
      </div>
    </div>
  `
})
export class JobFormComponent implements OnInit {
  jobForm: FormGroup;
  isEditMode = false;
  jobId: number | null = null;
  loading = false;
  submitting = false;
  error = '';

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private jobService: JobService
  ) {
    this.jobForm = this.fb.group({
      title: ['', Validators.required],
      company: ['', Validators.required],
      description: ['', Validators.required],
      status: [JobStatus.Active]
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.jobId = Number(id);
      this.loadJob();
    }
  }

  loadJob(): void {
    if (!this.jobId) return;
    
    this.loading = true;
    this.error = '';
    
    this.jobService.getJob(this.jobId).subscribe({
      next: (job) => {
        this.jobForm.patchValue({
          title: job.title,
          company: job.company,
          description: job.description,
          status: job.status
        });
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Failed to load job details';
        this.loading = false;
      }
    });
  }

  onSubmit(): void {
    if (this.jobForm.valid) {
      this.submitting = true;
      this.error = '';
      
      const request$ = this.isEditMode && this.jobId
        ? this.jobService.updateJob(this.jobId, this.jobForm.value)
        : this.jobService.createJob(this.jobForm.value);
      
      request$.subscribe({
        next: (job) => {
          this.router.navigate(['/admin']);
        },
        error: (error) => {
          this.error = error.error?.message || `Failed to ${this.isEditMode ? 'update' : 'create'} job`;
          this.submitting = false;
        }
      });
    }
  }
}