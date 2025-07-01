import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  template: `
    <div class="min-h-screen bg-gray-50">
      <!-- Navigation -->
      <nav class="bg-white shadow-sm border-b border-gray-200">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex justify-between items-center h-16">
            <!-- Logo -->
            <div class="flex items-center">
              <div class="flex-shrink-0 flex items-center">
                <div class="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
                  <span class="text-white font-bold text-sm">JF</span>
                </div>
                <span class="ml-2 text-xl font-semibold text-gray-900">JobFindan</span>
              </div>
            </div>

            <!-- Navigation Links -->
            <div class="hidden md:block">
              <div class="ml-10 flex items-baseline space-x-4">
                <a 
                  (click)="navigateToRoute('/')"
                  class="px-3 py-2 rounded-md text-sm font-medium cursor-pointer"
                  [class]="isActiveRoute('/') ? 'bg-orange-100 text-orange-700' : 'text-gray-600 hover:text-gray-900'"
                >
                  Explore Jobs
                </a>
                <a 
                  *ngIf="!authService.isAdmin"
                  (click)="navigateToRoute('/applications')"
                  class="px-3 py-2 rounded-md text-sm font-medium cursor-pointer"
                  [class]="isActiveRoute('/applications') ? 'bg-orange-100 text-orange-700' : 'text-gray-600 hover:text-gray-900'"
                >
                  Applications
                </a>
                <a 
                  *ngIf="authService.isAdmin"
                  (click)="navigateToRoute('/admin')"
                  class="px-3 py-2 rounded-md text-sm font-medium cursor-pointer"
                  [class]="isActiveRoute('/admin') ? 'bg-orange-100 text-orange-700' : 'text-gray-600 hover:text-gray-900'"
                >
                  Admin Panel
                </a>
              </div>
            </div>

            <!-- User Menu -->
            <div class="flex items-center space-x-4">
              <div class="flex items-center space-x-3">
                <div class="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                  <span class="text-gray-600 text-sm font-medium">
                    {{ (authService.currentUser$ | async)?.firstName?.charAt(0) }}{{ (authService.currentUser$ | async)?.lastName?.charAt(0) }}
                  </span>
                </div>
                <div class="hidden md:block">
                  <div class="text-sm font-medium text-gray-900">
                    {{ (authService.currentUser$ | async)?.firstName }} {{ (authService.currentUser$ | async)?.lastName }}
                  </div>
                  <div class="text-xs text-gray-500">
                    {{ (authService.currentUser$ | async)?.username }}
                  </div>
                </div>
                <button 
                  (click)="logout()"
                  class="btn btn-outline text-sm"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <!-- Main Content -->
      <main>
        <router-outlet></router-outlet>
      </main>
    </div>
  `
})
export class MainLayoutComponent {
  constructor(
    public authService: AuthService,
    private router: Router
  ) {}

  navigateToRoute(route: string): void {
    this.router.navigate([route]);
  }

  isActiveRoute(route: string): boolean {
    return this.router.url === route;
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}