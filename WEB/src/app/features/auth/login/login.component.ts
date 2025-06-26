import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div class="max-w-md w-full bg-white p-8 rounded-xl shadow-lg">
        <h2 class="text-2xl font-semibold text-center text-gray-800 mb-6">Sign in to your account</h2>

        <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="space-y-5">
          <div>
            <label class="block text-sm font-medium text-gray-700">Email</label>
            <input type="email" formControlName="email" class="mt-1 w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500" />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">Password</label>
            <input type="password" formControlName="password" class="mt-1 w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500" />
          </div>

          <button type="submit" [disabled]="loginForm.invalid" class="w-full bg-orange-500 hover:bg-orange-600 text-white py-2 rounded-lg font-semibold transition duration-200">Login</button>
        </form>

        <p class="mt-4 text-center text-sm text-gray-600">
          Don’t have an account?
          <a routerLink="/register" class="text-orange-500 hover:underline font-medium">Register</a>
        </p>
      </div>
    </div>
  `
})
export class LoginComponent {
  loginForm: FormGroup;

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
      this.authService.login(email, password).subscribe(() => {
        this.router.navigate(['/dashboard']);
      });
    }
  }
}
