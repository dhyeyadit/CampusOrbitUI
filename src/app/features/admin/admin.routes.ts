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
  {
    path: 'company',
    loadComponent: () =>
      import('../shared/views/company/company.component').then(
        (m) => m.CompanyComponent
      ),
      canActivate: [MsalGuard],
  },
  {
    path: 'campus-drives',
    loadComponent: () =>
      import('../shared/views/campus-drives/campus-drives.component').then(
        (m) => m.CampusDrivesComponent
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
  },
  {
    path: 'manage-students',
    loadComponent: () =>
      import('../shared/views/manage-students/manage-students.component').then(
        (m) => m.ManageStudentsComponent
      ),
      canActivate: [MsalGuard],
  },
  {
    path: 'manage-tpc',
    loadComponent: () =>
      import('./views/manage-tpc/manage-tpc.component').then(
        (m) => m.ManageTpcComponent
      ),
      canActivate: [MsalGuard],
  },{
    path: 'security',
    loadComponent: () =>
      import('./views/security/security.component').then(
        (m) => m.SecurityComponent
      ),
      canActivate: [MsalGuard],
  },
];
