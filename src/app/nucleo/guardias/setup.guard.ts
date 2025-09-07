/**
 * @file setup.guard.ts
 * @description Guardia que verifica si existen usuarios en el sistema
 * Redirige a la página de configuración inicial si no hay usuarios
 * 
 * TP Final Algoritmos y Estructuras de Datos III - 2025
 * Alumnos: CANCELO JULIAN - NICOLAS OTERO (Curso 3ra 1RA)
 * Profesor: Sebastian Saldivar
 */
import { Injectable, inject } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { Observable, map } from 'rxjs';
import { AuthService } from '../servicios/auth.service';

/**
 * @class SetupGuard
 * @description Guardia que verifica si hay usuarios en el sistema
 * Si no hay usuarios, redirige a la página de configuración inicial
 */
@Injectable({
  providedIn: 'root'
})
export class SetupGuard implements CanActivate {
  private authService = inject(AuthService);
  private router = inject(Router);

  /**
   * @method canActivate
   * @description Verifica si se puede activar la ruta dependiendo de si hay usuarios
   * @returns Observable<boolean | UrlTree> - true si hay usuarios, o UrlTree para redirigir
   */
  canActivate(): Observable<boolean | UrlTree> {
    return this.authService.checkIfUsersExist().pipe(
      map(hasUsers => {
        // Si hay usuarios, permitimos el acceso a la ruta
        if (hasUsers) {
          return true;
        }
        
        // Si no hay usuarios, redirigimos a la página de configuración inicial
        return this.router.createUrlTree(['/setup']);
      })
    );
  }
}

/**
 * @class NoUsersGuard
 * @description Guardia para la página de configuración inicial
 * Si ya existen usuarios, redirige al login
 */
@Injectable({
  providedIn: 'root'
})
export class NoUsersGuard implements CanActivate {
  private authService = inject(AuthService);
  private router = inject(Router);

  /**
   * @method canActivate
   * @description Verifica si se puede acceder a la página de configuración inicial
   * @returns Observable<boolean | UrlTree> - true si no hay usuarios, o UrlTree para redirigir
   */
  canActivate(): Observable<boolean | UrlTree> {
    return this.authService.checkIfUsersExist().pipe(
      map(hasUsers => {
        // Si no hay usuarios, permitimos el acceso a la configuración inicial
        if (!hasUsers) {
          return true;
        }
        
        // Si ya hay usuarios, redirigimos al login
        return this.router.createUrlTree(['/auth/login']);
      })
    );
  }
}
