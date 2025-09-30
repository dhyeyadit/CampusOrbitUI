import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'student',
    loadChildren: () =>
      import('./features/student/student.routes').then(
        (m) => m.studentRoutes
      ),
  },
  {
    path: 'tpc',
    loadChildren: () =>
      import('./features/tpc/tpc.routes').then((m) => m.tpcRoutes),
  },
  {
    path: 'admin',
    loadChildren: () =>
      import('./features/admin/admin.routes').then((m) => m.adminRoutes),
  },
  { path: '', redirectTo: 'student', pathMatch: 'full' },
];
