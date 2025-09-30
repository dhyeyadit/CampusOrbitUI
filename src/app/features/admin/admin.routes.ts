import { Routes } from '@angular/router';
import { MsalGuard } from '@azure/msal-angular';

export const adminRoutes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./views/dashboard/dashboard.component').then(
        (m) => m.DashboardComponent
      ),
      canActivate: [MsalGuard],
  },
];
