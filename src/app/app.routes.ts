/**
 * @file app.routes.ts
 * @description Configuración principal de rutas de la aplicación
 * Define todas las rutas disponibles y sus guardias de autorización
 */

// Importación del tipo Routes desde el módulo de enrutamiento de Angular
import { Routes } from '@angular/router';

// Importación de guardias de seguridad para proteger rutas
import { AuthGuard } from './nucleo/guardias/auth.guard';     // Guardia para verificar autenticación
import { RoleGuard } from './nucleo/guardias/role.guard';      // Guardia para verificar roles
import { SetupGuard, NoUsersGuard } from './nucleo/guardias/setup.guard'; // Guardias para verificar existencia de usuarios

// Importación de componentes para rutas públicas
import { HomeComponent } from './funcionalidades/inicio/home.component';     // Página principal
import { GalleryComponent } from './funcionalidades/galeria/gallery.component'; // Página de galería
import { SetupComponent } from './nucleo/configuracion-inicial/setup.component'; // Configuración inicial

/**
 * @constant routes
 * @description Configuración de rutas de la aplicación
 * Define la estructura de navegación y permisos de acceso
 */
export const routes: Routes = [
  /**
   * Página de configuración inicial
   * Solo accesible cuando no hay usuarios en el sistema
   */
  {
    path: 'setup',  // URL: /setup
    component: SetupComponent,  // Componente de configuración inicial
    canActivate: [NoUsersGuard]  // Solo accesible si no hay usuarios
  },
  
  /**
   * Ruta principal (página de inicio)
   * Accesible para todos los usuarios, pero verifica si hay usuarios en el sistema
   */
  {
    path: '',  // URL base (ej. https://dominio.com/)
    component: HomeComponent,  // Componente que se muestra en esta ruta
    canActivate: [SetupGuard]  // Verifica si hay usuarios en el sistema
  },
  
  /**
   * Página de instalaciones/galería
   * Accesible para todos los usuarios, pero verifica si hay usuarios en el sistema
   */
  {
    path: 'instalaciones',  // URL: /instalaciones
    component: GalleryComponent,  // Componente que muestra la galería
    canActivate: [SetupGuard]  // Verifica si hay usuarios en el sistema
  },
  
  /**
   * Módulo de autenticación (login, registro, etc.)
   * Utiliza carga perezosa (lazy loading) para mejorar el rendimiento
   * Verifica si hay usuarios en el sistema antes de permitir el acceso
   */
  {
    path: 'auth',  // URL base: /auth/*
    // Importación dinámica del módulo de autenticación
    loadChildren: () => import('./funcionalidades/autenticacion/auth-routing.module').then(m => m.AuthRoutingModule),
    canActivate: [SetupGuard]  // Verifica si hay usuarios en el sistema
  },
  
  /**
   * Panel de control (Dashboard)
   * Requiere autenticación para acceder
   */
  {
    path: 'dashboard',  // URL: /dashboard
    // Carga el componente principal del dashboard bajo demanda
    loadComponent: () => import('./diseno/panel/dashboard.component').then(c => c.DashboardComponent),
    canActivate: [AuthGuard],  // Protección con guardia de autenticación
    // Rutas hijas dentro del dashboard
    children: [{
      path: '',  // URL: /dashboard
      // Carga el componente de inicio del dashboard bajo demanda
      loadComponent: () => import('./diseno/panel/panel-inicio/dashboard-home.component').then(c => c.DashboardHomeComponent)
    }]
  },
  
  /**
   * Módulo de estudiantes
   * Requiere autenticación y rol específico para acceder
   */
  {
    path: 'estudiantes',  // URL: /estudiantes/*
    // Importación dinámica del módulo de estudiantes
    loadChildren: () => import('./funcionalidades/estudiantes/students.module').then(m => m.StudentsModule),
    canActivate: [AuthGuard, RoleGuard],  // Requiere autenticación y verificación de rol
    data: { requiredRoles: ['admin', 'secretario'] }  // Roles permitidos para acceder
  },
  
  /**
   * Página de gestión de usuarios
   * Requiere autenticación y rol de administrador
   */
  {
    path: 'gestion-usuarios',  // URL: /gestion-usuarios
    // Carga el componente de gestión de usuarios bajo demanda
    loadComponent: () => import('./funcionalidades/administracion/gestion-usuarios/gestion-usuarios.component').then(c => c.GestionUsuariosComponent),
    canActivate: [AuthGuard, RoleGuard],  // Requiere autenticación y verificación de rol
    data: { requiredRoles: ['admin'] }  // Solo administradores pueden acceder
  },
  
  /**
   * Módulo de registro de usuarios
   * Requiere autenticación y rol de administrador
   */
  {
    path: 'registro-usuario',  // URL: /registro-usuario/*
    // Importación dinámica del módulo de registro de usuario
    loadChildren: () => import('./funcionalidades/administracion/registro-usuario/registro-usuario.module').then(m => m.RegistroUsuarioModule),
    canActivate: [AuthGuard, RoleGuard],  // Requiere autenticación y verificación de rol
    data: { requiredRoles: ['admin'] }  // Solo administradores pueden acceder
  },
  
  /**
   * Ruta por defecto para URLs no existentes (fallback)
   * Redirecciona a la página principal
   */
  {
    path: '**',  // Cualquier ruta que no coincida con las anteriores
    redirectTo: ''  // Redirecciona a la página principal
  }
];
