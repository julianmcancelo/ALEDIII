import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router } from '@angular/router';
import { AuthService } from '../servicios/auth.service';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {
  
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const requiredRoles = route.data['roles'] as Array<string>;
    const currentUser = this.authService.getCurrentUser();

    if (!currentUser) {
      this.router.navigate(['/auth/login']);
      return false;
    }

    if (requiredRoles && requiredRoles.length > 0) {
      const hasPermission = requiredRoles.some(role => currentUser.role === role);
      if (hasPermission) {
        return true;
      }
    }

    // Si no tiene el rol requerido, redirigir a una página de acceso denegado o al dashboard
    this.router.navigate(['/dashboard']); 
    return false;
  }
}
