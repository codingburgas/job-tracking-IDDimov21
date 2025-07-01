import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
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
          <h2 class="mt-6 text-3xl font-bold text-gray-900">Welcome back</h2>
          <p class="mt-2 text-sm text-gray-600">
            Sign in to your account to continue
          </p>
        </div>

        <!-- Form -->
        <form class="mt-8 space-y-6" [formGroup]="loginForm" (ngSubmit)="onSubmit()">
          <div class="space-y-4">
            <div>
              <label for="username" class="block text-sm font-medium text-gray-700">Username</label>
              <input
                id="username"
                type="text"
                formControlName="username"
                class="form-input mt-1"
                placeholder="Enter your username"
              />
              <div *ngIf="loginForm.get('username')?.invalid && loginForm.get('username')?.touched" class="mt-1 text-sm text-red-600">
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
                placeholder="Enter your password"
              />
              <div *ngIf="loginForm.get('password')?.invalid && loginForm.get('password')?.touched" class="mt-1 text-sm text-red-600">
                Password is required
              </div>
            </div>
          </div>

          <div *ngIf="errorMessage" class="text-sm text-red-600 text-center">
            {{ errorMessage }}
          </div>

          <div>
            <button
              type="submit"
              [disabled]="loginForm.invalid || loading"
              class="w-full btn btn-primary py-3 text-sm font-medium"
            >
              <span *ngIf="loading">Signing in...</span>
              <span *ngIf="!loading">Sign in</span>
            </button>
          </div>

          <div class="text-center">
            <p class="text-sm text-gray-600">
              Don't have an account?
              <a routerLink="/register" class="font-medium text-orange-600 hover:text-orange-500">
                Sign up
              </a>
            </p>
          </div>

          <!-- Demo Accounts -->
          <div class="mt-6 p-4 bg-blue-50 rounded-lg">
            <h3 class="text-sm font-medium text-blue-900 mb-2">Demo Accounts:</h3>
            <div class="space-y-1 text-xs text-blue-700">
              <div><strong>Admin:</strong> username: admin, password: admin123</div>
              <div><strong>User:</strong> Register a new account or use existing user credentials</div>
            </div>
          </div>
        </form>
      </div>
    </div>
  `
})
export class LoginComponent {
  loginForm: FormGroup;
  loading = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });

    // Redirect if already logged in
    if (this.authService.isLoggedIn) {
      this.router.navigate(['/']);
    }
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.loading = true;
      this.errorMessage = '';

      this.authService.login(this.loginForm.value).subscribe({
        next: () => {
          this.router.navigate(['/']);
        },
        error: (error) => {
          this.loading = false;
          this.errorMessage = error.error?.message || 'Login failed. Please try again.';
        }
      });
    }
  }
}