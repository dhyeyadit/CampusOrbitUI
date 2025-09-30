// src/app/features/student/student.routes.ts

import { Routes } from '@angular/router';

export const studentRoutes: Routes = [
    {
    path: '',
    loadComponent: () =>
      import('./views/dashboard/dashboard.component').then(
        (m) => m.DashboardComponent
      ),
  },
    {
    path: '',
    loadComponent: () =>
      import('./views/profile/profile.component').then(
        (m) => m.ProfileComponent
      ),
  },
  {
    path: ':id',
    loadComponent: () =>
      import('./views/registrations/registrations.component').then(
        (m) => m.RegistrationsComponent
      ),
  },
];
