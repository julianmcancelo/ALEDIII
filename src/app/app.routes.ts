import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';
import { RoleGuard } from './core/guards/role.guard';
import { HomeComponent } from './features/home/home.component';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent
  },
  {
    path: 'auth',
    loadChildren: () => import('./features/auth/auth-routing.module').then(m => m.AuthRoutingModule)
  },
  {
    path: 'dashboard',
    canActivate: [AuthGuard],
    loadComponent: () => import('./layout/dashboard/dashboard.component').then(m => m.DashboardComponent),
    children: [
      { path: '', loadComponent: () => import('./layout/dashboard/dashboard-home/dashboard-home.component').then(m => m.DashboardHomeComponent) },
    ]
  },
  {
    path: 'estudiantes',
    loadChildren: () => import('./features/students/students-routing.module').then(m => m.StudentsRoutingModule),
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['admin', 'profesor'] }
  },
  {
    path: '**',
    redirectTo: ''
  }
];
