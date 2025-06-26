import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./dashboard.component').then(c => c.DashboardComponent)
  },
  {
    path: 'jobs/:id',
    loadComponent: () => import('./job-details/job-details.component').then(c => c.JobDetailsComponent)
  },
  {
    path: 'applications',
    loadComponent: () => import('./applications/applications.component').then(c => c.ApplicationsComponent)
  }
];