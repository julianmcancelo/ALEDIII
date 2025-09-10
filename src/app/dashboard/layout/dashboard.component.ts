/**
 * @file dashboard.component.ts
 * @description Componente principal del panel de control (Dashboard)
 * Proporciona la estructura de navegación y acceso a las diferentes secciones del sistema
 * Implementa un menú lateral con opciones dependientes del rol del usuario
 */
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterModule, Router } from '@angular/router';
import { AuthService, User } from '../../nucleo/servicios/auth.service';
import { SidebarComponent } from '../components/sidebar/sidebar.component';

// Angular Material Imports
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';

/**
 * @class DashboardComponent
 * @description Componente principal del panel de administración
 * Muestra la interfaz de usuario del sistema con navegación adaptada según el rol
 */
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule, 
    RouterOutlet,
    RouterModule,
    SidebarComponent,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatDividerModule,
    MatSidenavModule,
    MatListModule
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
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
  showSidebar = window.innerWidth > 782;
  
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
