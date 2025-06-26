import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { User, UserRole } from '../../../core/models/auth.models';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    <nav class="bg-white shadow-sm border-b">
      <div class="container">
        <div class="flex items-center justify-between h-16">
          <div class="flex items-center gap-8">
            <h1 class="text-xl font-bold text-gray-900">JobSearch</h1>
            
            <div class="flex items-center gap-4" *ngIf="currentUser">
              <a routerLink="/dashboard" 
                 routerLinkActive="text-blue-600 border-b-2 border-blue-600"
                 class="px-3 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors">
                Dashboard
              </a>
              
              <a *ngIf="isAdmin" 
                 routerLink="/admin" 
                 routerLinkActive="text-blue-600 border-b-2 border-blue-600"
                 class="px-3 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors">
                Admin Panel
              </a>
            </div>
          </div>

          <div class="flex items-center gap-4" *ngIf="currentUser">
            <span class="text-sm text-gray-600">
              Welcome, {{ currentUser.firstName }} {{ currentUser.lastName }}
            </span>
            <span class="badge badge-info">{{ currentUser.role }}</span>
            <button (click)="logout()" class="btn btn-secondary btn-sm">
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  `
})
export class NavbarComponent {
  currentUser: User | null = null;

  constructor(private authService: AuthService, private router: Router) {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });
  }

  get isAdmin(): boolean {
    return this.currentUser?.role === UserRole.ADMIN;
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }
}