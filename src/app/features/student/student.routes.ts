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
    path: '',
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
}

];
