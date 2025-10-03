// src/app/features/student/student.routes.ts

import { Routes } from '@angular/router';
import { MsalGuard } from '@azure/msal-angular';

export const studentRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./views/dashboard/dashboard.component').then(
        (m) => m.DashboardComponent
      ),
    canActivate: [MsalGuard],
  },
  {
    path: 'profile',
    loadComponent: () =>
      import('./views/profile/profile.component').then(
        (m) => m.ProfileComponent
      ),
    canActivate: [MsalGuard],
  },
  {
    path: 'registrations',
    loadComponent: () =>
      import('./views/registrations/registrations.component').then(
        (m) => m.RegistrationsComponent
      ),
    canActivate: [MsalGuard],
  },
  {
    path: 'upcoming-drives',
    loadComponent: () =>
      import('./views/upcoming-drives/upcoming-drives.component').then(
        (m) => m.UpcomingDrivesComponent
      ),
    canActivate: [MsalGuard],
  },
  {
    path: 'study-material',
    loadComponent: () =>
      import('../shared/views/study-material/study-material.component').then(
        (m) => m.StudyMaterialComponent
      ),
    canActivate: [MsalGuard],
  }

];
