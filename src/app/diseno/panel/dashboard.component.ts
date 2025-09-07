/**
 * @file dashboard.component.ts
 * @description Componente principal del panel de control (Dashboard)
 * Proporciona la estructura de navegación y acceso a las diferentes secciones del sistema
 * Implementa un menú lateral con opciones dependientes del rol del usuario
 */
import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService, User } from '../../nucleo/servicios/auth.service';
import { CommonModule } from '@angular/common';

/**
 * @class DashboardComponent
 * @description Componente principal del panel de administración
 * Muestra la interfaz de usuario del sistema con navegación adaptada según el rol
 */
@Component({
  selector: 'app-dashboard',      // Selector CSS para este componente
  standalone: true,               // Componente independiente (sin NgModule)
  imports: [CommonModule, RouterModule], // Módulos necesarios
  template: `
    <div class="min-h-screen bg-gray-50">
      <!-- Header -->
      <header class="bg-blue-600 text-white shadow-md">
        <div class="flex items-center justify-between px-6 py-4">
          <button (click)="toggleSidebar()" class="p-2 rounded hover:bg-blue-700">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
            </svg>
          </button>
          <span class="flex-1 ml-4 text-xl font-semibold">Instituto Tecnológico Beltrán</span>
          
          <div class="relative">
            <button (click)="toggleUserMenu()" class="flex items-center space-x-2 p-2 rounded hover:bg-blue-700">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
              </svg>
              <span>{{currentUser?.name}}</span>
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            </button>
            
            <div *ngIf="showUserMenu" class="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
              <a href="#" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Perfil</a>
              <a href="#" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Configuración</a>
              <hr class="my-1">
              <button (click)="logout()" class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Cerrar Sesión</button>
            </div>
          </div>
        </div>
      </header>

      <div class="flex">
        <!-- Sidebar -->
        <nav *ngIf="showSidebar" class="w-64 bg-white shadow-lg min-h-screen">
          <div class="p-4">
            <ul class="space-y-2">
              <li>
                <a routerLink="/dashboard" routerLinkActive="bg-blue-100 text-blue-700" 
                   class="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 transition-colors">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"></path>
                  </svg>
                  <span>Dashboard</span>
                </a>
              </li>
              
              <li *ngIf="currentUser?.role === 'admin' || currentUser?.role === 'profesor'">
                <a routerLink="/estudiantes" routerLinkActive="bg-blue-100 text-blue-700"
                   class="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 transition-colors">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 14l9-5-9-5-9 5 9 5z"></path>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"></path>
                  </svg>
                  <span>Estudiantes</span>
                </a>
              </li>
              
              <li *ngIf="currentUser?.role === 'admin'">
                <a routerLink="/gestion-usuarios" routerLinkActive="bg-blue-100 text-blue-700"
                   class="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 transition-colors">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"></path>
                  </svg>
                  <span>Gestión de Usuarios</span>
                </a>
              </li>
              
              <li *ngIf="currentUser?.role === 'admin' || currentUser?.role === 'profesor'">
                <a routerLink="/courses" routerLinkActive="bg-blue-100 text-blue-700"
                   class="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 transition-colors">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
                  </svg>
                  <span>Cursos</span>
                </a>
              </li>
              
              <li *ngIf="currentUser?.role === 'admin'">
                <a routerLink="/reports" routerLinkActive="bg-blue-100 text-blue-700"
                   class="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 transition-colors">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                  </svg>
                  <span>Reportes</span>
                </a>
              </li>
              
              <li>
                <a routerLink="/instalaciones" routerLinkActive="bg-blue-100 text-blue-700"
                   class="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 transition-colors">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                  </svg>
                  <span>Instalaciones</span>
                </a>
              </li>
              
              <li class="border-t pt-2 mt-4">
                <a routerLink="/profile" routerLinkActive="bg-blue-100 text-blue-700"
                   class="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 transition-colors">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                  </svg>
                  <span>Mi Perfil</span>
                </a>
              </li>
            </ul>
          </div>
        </nav>

        <!-- Main Content -->
        <main class="flex-1 p-6">
          <router-outlet></router-outlet>
        </main>
      </div>
    </div>
  `
})
/**
 * Clase principal del componente Dashboard
 * Implementa la estructura central de navegación y menú del sistema
 */
export class DashboardComponent implements OnInit {
  /**
   * @property currentUser
   * @description Usuario actualmente autenticado
   * Determina los permisos y opciones de navegación visibles
   */
  currentUser: User | null = null;
  
  /**
   * @property showSidebar
   * @description Controla la visibilidad del menú lateral
   * Permite ocultar/mostrar el menú en pantallas pequeñas
   */
  showSidebar = true;
  
  /**
   * @property showUserMenu
   * @description Controla la visibilidad del menú desplegable de usuario
   * Por defecto está oculto y se muestra al hacer clic en el perfil
   */
  showUserMenu = false;

  /**
   * @constructor
   * @param authService Servicio de autenticación para obtener el usuario actual
   * @param router Servicio de navegación para redirecciones
   */
  constructor(
    private authService: AuthService, // Servicio para gestión de autenticación
    private router: Router            // Servicio para navegación entre rutas
  ) {}

  /**
   * @method ngOnInit
   * @description Método del ciclo de vida que se ejecuta al inicializar el componente
   * Se suscribe al observable de usuario actual para obtener su información
   */
  ngOnInit(): void {
    // Suscripción al observable del usuario actual
    // Esto permite reaccionar automáticamente si cambia el estado de autenticación
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });
  }

  /**
   * @method toggleSidebar
   * @description Alterna la visibilidad de la barra lateral
   * Usado principalmente en dispositivos móviles o para maximizar el espacio de trabajo
   */
  toggleSidebar(): void {
    this.showSidebar = !this.showSidebar; // Invierte el valor actual
  }

  /**
   * @method toggleUserMenu
   * @description Alterna la visibilidad del menú de usuario
   * Muestra u oculta opciones como perfil, configuración y cerrar sesión
   */
  toggleUserMenu(): void {
    this.showUserMenu = !this.showUserMenu; // Invierte el valor actual
  }

  /**
   * @method logout
   * @description Cierra la sesión del usuario actual
   * Llama al método logout del servicio de autenticación y oculta el menú de usuario
   */
  logout(): void {
    this.authService.logout();     // Cierra la sesión en el servicio de autenticación
    this.showUserMenu = false;     // Oculta el menú de usuario
  }
  
  /**
   * @note Componente implementado como parte del TP Final
   * Algoritmos y Estructuras de Datos III - 2025
   * Alumnos: CANCELO JULIAN - NICOLAS OTERO (Curso 3ra 1RA)
   */
}
