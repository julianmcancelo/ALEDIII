/**
 * @file auth.guard.ts
 * @description Guardia de autenticación que protege rutas contra accesos no autorizados
 * Verifica que el usuario esté autenticado antes de permitir la navegación a rutas protegidas
 */
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../servicios/auth.service';

/**
 * @class AuthGuard
 * @description Guardia que implementa la interfaz CanActivate para proteger rutas
 * Solo permite acceso a usuarios autenticados y redirecciona a la página de login
 * cuando el usuario no está autenticado
 */
@Injectable({
  providedIn: 'root'  // El guardia está disponible en toda la aplicación
})
export class AuthGuard implements CanActivate {
  
  /**
   * @constructor
   * @param {AuthService} authService - Servicio de autenticación para verificar el estado de login
   * @param {Router} router - Servicio de enrutamiento para redireccionar si es necesario
   */
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  /**
   * @method canActivate
   * @description Método requerido por la interfaz CanActivate
   * Determina si una ruta puede ser activada (navegada)
   * @returns {boolean} true si el usuario está autenticado, false en caso contrario
   */
  canActivate(): boolean {
    // Verifica si el usuario está logueado
    if (this.authService.isLoggedIn()) {
      return true;  // Permite el acceso a la ruta
    } else {
      // Redirecciona al usuario a la página de login
      this.router.navigate(['/auth/login']);
      return false;  // Bloquea el acceso a la ruta
    }
  }
}
