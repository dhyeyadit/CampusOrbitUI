import { Routes } from '@angular/router';
import { DashboardComponent } from './views/dashboard/dashboard.component';

export const tpcRoutes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./views/dashboard/dashboard.component').then(
        (m) => m.DashboardComponent
      ),
  },
];
