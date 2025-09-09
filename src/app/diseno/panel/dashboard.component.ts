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
import { SidebarComponent } from './sidebar/sidebar.component';

/**
 * @class DashboardComponent
 * @description Componente principal del panel de administración
 * Muestra la interfaz de usuario del sistema con navegación adaptada según el rol
 */
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, SidebarComponent],
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
        <!-- Dynamic Sidebar -->
        <app-sidebar *ngIf="showSidebar"></app-sidebar>

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
