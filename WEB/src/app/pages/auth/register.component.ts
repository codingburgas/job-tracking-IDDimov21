import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div class="max-w-md w-full space-y-8">
        <!-- Header -->
        <div class="text-center">
          <div class="flex justify-center">
            <div class="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center">
              <span class="text-white font-bold text-lg">JF</span>
            </div>
          </div>
          <h2 class="mt-6 text-3xl font-bold text-gray-900">Create your account</h2>
          <p class="mt-2 text-sm text-gray-600">
            Join JobFindan to find your dream job
          </p>
        </div>

        <!-- Form -->
        <form class="mt-8 space-y-6" [formGroup]="registerForm" (ngSubmit)="onSubmit()">
          <div class="space-y-4">
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label for="firstName" class="block text-sm font-medium text-gray-700">First Name</label>
                <input
                  id="firstName"
                  type="text"
                  formControlName="firstName"
                  class="form-input mt-1"
                  placeholder="First name"
                />
                <div *ngIf="registerForm.get('firstName')?.invalid && registerForm.get('firstName')?.touched" class="mt-1 text-sm text-red-600">
                  First name is required
                </div>
              </div>
              <div>
                <label for="lastName" class="block text-sm font-medium text-gray-700">Last Name</label>
                <input
                  id="lastName"
                  type="text"
                  formControlName="lastName"
                  class="form-input mt-1"
                  placeholder="Last name"
                />
                <div *ngIf="registerForm.get('lastName')?.invalid && registerForm.get('lastName')?.touched" class="mt-1 text-sm text-red-600">
                  Last name is required
                </div>
              </div>
            </div>

            <div>
              <label for="middleName" class="block text-sm font-medium text-gray-700">Middle Name (Optional)</label>
              <input
                id="middleName"
                type="text"
                formControlName="middleName"
                class="form-input mt-1"
                placeholder="Middle name"
              />
            </div>

            <div>
              <label for="username" class="block text-sm font-medium text-gray-700">Username</label>
              <input
                id="username"
                type="text"
                formControlName="username"
                class="form-input mt-1"
                placeholder="Choose a username"
              />
              <div *ngIf="registerForm.get('username')?.invalid && registerForm.get('username')?.touched" class="mt-1 text-sm text-red-600">
                Username is required
              </div>
            </div>

            <div>
              <label for="password" class="block text-sm font-medium text-gray-700">Password</label>
              <input
                id="password"
                type="password"
                formControlName="password"
                class="form-input mt-1"
                placeholder="Create a password"
              />
              <div *ngIf="registerForm.get('password')?.invalid && registerForm.get('password')?.touched" class="mt-1 text-sm text-red-600">
                Password must be at least 6 characters
              </div>
            </div>
          </div>

          <div *ngIf="errorMessage" class="text-sm text-red-600 text-center">
            {{ errorMessage }}
          </div>

          <div>
            <button
              type="submit"
              [disabled]="registerForm.invalid || loading"
              class="w-full btn btn-primary py-3 text-sm font-medium"
            >
              <span *ngIf="loading">Creating account...</span>
              <span *ngIf="!loading">Create account</span>
            </button>
          </div>

          <div class="text-center">
            <p class="text-sm text-gray-600">
              Already have an account?
              <a routerLink="/login" class="font-medium text-orange-600 hover:text-orange-500">
                Sign in
              </a>
            </p>
          </div>
        </form>
      </div>
    </div>
  `
})
export class RegisterComponent {
  registerForm: FormGroup;
  loading = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      firstName: ['', Validators.required],
      middleName: [''],
      lastName: ['', Validators.required],
      username: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });

    // Redirect if already logged in
    if (this.authService.isLoggedIn) {
      this.router.navigate(['/']);
    }
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      this.loading = true;
      this.errorMessage = '';

      this.authService.register(this.registerForm.value).subscribe({
        next: () => {
          this.router.navigate(['/']);
        },
        error: (error) => {
          this.loading = false;
          this.errorMessage = error.error?.message || 'Registration failed. Please try again.';
        }
      });
    }
  }
}