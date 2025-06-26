import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./admin-dashboard/admin-dashboard.component').then(c => c.AdminDashboardComponent)
  },
  {
    path: 'jobs/new',
    loadComponent: () => import('./job-form/job-form.component').then(c => c.JobFormComponent)
  },
  {
    path: 'jobs/:id/edit',
    loadComponent: () => import('./job-form/job-form.component').then(c => c.JobFormComponent)
  },
  {
    path: 'jobs/:id/applications',
    loadComponent: () => import('./job-applications/job-applications.component').then(c => c.JobApplicationsComponent)
  }
];