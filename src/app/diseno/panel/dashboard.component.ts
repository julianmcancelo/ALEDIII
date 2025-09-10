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
    <div class="wp-admin-container">
      <!-- WordPress-style Header -->
      <header class="wp-admin-header">
        <div class="wp-header-content">
          <div class="wp-header-left">
            <button (click)="toggleSidebar()" class="wp-menu-toggle">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
              </svg>
            </button>
            <div class="wp-admin-logo">
              <svg class="wp-logo-icon" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.219-5.175 1.219-5.175s-.31-.653-.31-1.219c0-1.141.653-1.992 1.466-1.992.653 0 .986.5.986 1.105 0 .653-.415 1.634-.653 2.54-.199.828.415 1.497 1.219 1.497 1.466 0 2.594-1.544 2.594-3.77 0-1.97-1.415-3.348-3.439-3.348-2.344 0-3.717 1.759-3.717 3.575 0 .706.275 1.466.653 1.88.072.085.085.159.063.246-.069.289-.219.936-.25 1.067-.041.17-.134.207-.31.125-1.15-.537-1.88-2.219-1.88-3.575 0-2.594 1.88-4.973 5.417-4.973 2.844 0 5.054 2.025 5.054 4.734 0 2.823-1.78 5.094-4.25 5.094-.828 0-1.609-.431-1.88-.941 0 0-.415 1.58-.5 1.967-.199.756-.73 1.705-1.105 2.281C9.56 23.815 10.754 24.001 12.017 24.001c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001 12.017.001z"/>
              </svg>
            </div>
            <div class="wp-header-title">
              <h1>Instituto Tecnológico Beltrán</h1>
              <div class="wp-subtitle">Panel de Administración</div>
            </div>
          </div>
          
          <div class="wp-header-right">
            <div class="wp-user-menu">
              <button (click)="toggleUserMenu()" class="wp-user-toggle">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                </svg>
                <span>{{currentUser?.name}}</span>
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </button>
              
              <div *ngIf="showUserMenu" class="wp-user-dropdown">
                <a href="#" class="wp-dropdown-item">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                  </svg>
                  Perfil
                </a>
                <a href="#" class="wp-dropdown-item">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                  </svg>
                  Configuración
                </a>
                <div class="wp-dropdown-divider"></div>
                <button (click)="logout()" class="wp-dropdown-item wp-logout">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
                  </svg>
                  Cerrar Sesión
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div class="wp-admin-body">
        <!-- WordPress-style Sidebar -->
        <app-sidebar *ngIf="showSidebar" class="wp-sidebar"></app-sidebar>

        <!-- Main Content -->
        <main class="wp-main-content" [class.wp-sidebar-collapsed]="!showSidebar">
          <router-outlet></router-outlet>
        </main>
      </div>
    </div>

    <style>
      /* WordPress Admin Styles */
      .wp-admin-container {
        min-height: 100vh;
        background: #f1f1f1;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif;
      }

      .wp-admin-header {
        background: #23282d;
        color: white;
        box-shadow: 0 1px 1px rgba(0,0,0,.04);
        position: relative;
        z-index: 9999;
      }

      .wp-header-content {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 24px;
        height: 64px;
      }

      .wp-header-left {
        display: flex;
        align-items: center;
      }

      .wp-menu-toggle {
        background: none;
        border: none;
        color: #b4b9be;
        padding: 8px;
        border-radius: 3px;
        cursor: pointer;
        margin-right: 15px;
      }

      .wp-menu-toggle:hover {
        color: #00a0d2;
        background: rgba(0, 160, 210, 0.1);
      }

      .wp-admin-logo {
        margin-right: 15px;
      }

      .wp-logo-icon {
        color: #00a0d2;
        width: 32px;
        height: 32px;
      }

      .wp-header-title h1 {
        margin: 0;
        font-size: 22px;
        font-weight: 500;
        color: white;
        line-height: 1.3;
      }

      .wp-subtitle {
        font-size: 14px;
        color: #b4b9be;
        margin-top: 3px;
        font-weight: 400;
      }

      .wp-header-right {
        display: flex;
        align-items: center;
      }

      .wp-user-menu {
        position: relative;
      }

      .wp-user-toggle {
        display: flex;
        align-items: center;
        gap: 10px;
        background: none;
        border: none;
        color: #b4b9be;
        padding: 10px 16px;
        border-radius: 4px;
        cursor: pointer;
        font-size: 14px;
        font-weight: 500;
      }

      .wp-user-toggle:hover {
        color: #00a0d2;
        background: rgba(0, 160, 210, 0.1);
      }

      .wp-user-dropdown {
        position: absolute;
        right: 0;
        top: 100%;
        margin-top: 8px;
        background: white;
        border: 1px solid #ddd;
        border-radius: 3px;
        box-shadow: 0 3px 5px rgba(0,0,0,.2);
        min-width: 200px;
        z-index: 10000;
      }

      .wp-dropdown-item {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 10px 15px;
        color: #23282d;
        text-decoration: none;
        font-size: 13px;
        border: none;
        background: none;
        width: 100%;
        text-align: left;
        cursor: pointer;
      }

      .wp-dropdown-item:hover {
        background: #0073aa;
        color: white;
      }

      .wp-dropdown-divider {
        height: 1px;
        background: #ddd;
        margin: 5px 0;
      }

      .wp-logout {
        color: #a00;
      }

      .wp-logout:hover {
        background: #dc3232;
        color: white;
      }

      .wp-admin-body {
        display: flex;
        min-height: calc(100vh - 64px);
      }

      .wp-main-content {
        flex: 1;
        padding: 24px;
        margin-left: 0;
        transition: margin-left 0.15s ease-in-out;
        max-width: 1200px;
        margin: 0 auto;
      }

      .wp-sidebar {
        width: 180px;
        background: #23282d;
        border-right: 1px solid #3c434a;
      }

      .wp-sidebar-collapsed {
        margin-left: 0;
      }

      @media (max-width: 782px) {
        .wp-header-content {
          padding: 0 15px;
        }
        
        .wp-header-title h1 {
          font-size: 18px;
        }
        
        .wp-subtitle {
          display: none;
        }
        
        .wp-main-content {
          padding: 15px;
        }
      }
    </style>
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
