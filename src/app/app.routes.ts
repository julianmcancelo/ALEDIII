import { Routes } from '@angular/router';
import { AuthGuard } from './nucleo/guardias/auth.guard';
import { RoleGuard } from './nucleo/guardias/role.guard';
import { HomeComponent } from './funcionalidades/inicio/home.component';
import { GalleryComponent } from './funcionalidades/galeria/gallery.component';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent
  },
  {
    path: 'instalaciones',
    component: GalleryComponent
  },
  {
    path: 'auth',
    loadChildren: () => import('./funcionalidades/autenticacion/auth-routing.module').then(m => m.AuthRoutingModule)
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./diseno/panel/dashboard.component').then(c => c.DashboardComponent),
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        loadComponent: () => import('./diseno/panel/panel-inicio/dashboard-home.component').then(c => c.DashboardHomeComponent)
      },
      {
        path: 'estudiantes',
        loadChildren: () => import('./funcionalidades/estudiantes/students-routing.module').then(m => m.StudentsRoutingModule),
        canActivate: [AuthGuard, RoleGuard],
        data: { requiredRoles: ['admin', 'profesor'] } 
      },
      {
        path: 'gestion-usuarios',
        loadComponent: () => import('./funcionalidades/administracion/gestion-usuarios/gestion-usuarios.component').then(c => c.GestionUsuariosComponent),
        canActivate: [AuthGuard, RoleGuard],
        data: { requiredRoles: ['admin'] }
      },
      {
        path: 'gestion-carreras',
        loadComponent: () => import('./funcionalidades/administracion/gestion-carreras/gestion-carreras.component').then(c => c.GestionCarrerasComponent),
        canActivate: [AuthGuard, RoleGuard],
        data: { requiredRoles: ['admin'] }
      },
      {
        path: 'gestion-materias',
        loadComponent: () => import('./funcionalidades/administracion/gestion-materias/gestion-materias.component').then(c => c.GestionMateriasComponent),
        canActivate: [AuthGuard, RoleGuard],
        data: { requiredRoles: ['admin'] }
      }
    ]
  },
  {
    path: '**',
    redirectTo: ''
  }
];
