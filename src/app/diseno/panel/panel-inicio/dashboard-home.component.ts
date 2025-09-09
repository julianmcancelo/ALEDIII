import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService, User } from '../../../nucleo/servicios/auth.service';
import { DashboardService, DashboardStats } from '../../../nucleo/servicios/dashboard.service';
import { UserService, Usuario } from '../../../nucleo/servicios/user.service';
import { inject } from '@angular/core';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-dashboard-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard-home.component.html',
})
export class DashboardHomeComponent implements OnInit {
  currentUser: User | null = null;
  stats: DashboardStats = {
    estudiantesActivos: 0,
    cursosActivos: 0,
    profesores: 0,
    graduados2024: 0
  };
  cargandoStats = true;
  mostrarModalTipoUsuario = false;

  private authService = inject(AuthService);
  private userService = inject(UserService);
  private dashboardService = inject(DashboardService);
  private router = inject(Router);

  constructor() {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });

    this.cargarEstadisticas();
  }

  cargarEstadisticas(): void {
    this.cargandoStats = true;
    this.userService.getUsuarios().pipe(
      map((users: Usuario[]) => users.filter(u => u.role === 'student'))
    ).subscribe({
      next: (estudiantes: Usuario[]) => {
        this.stats.estudiantesActivos = estudiantes.length;
        this.cargandoStats = false;
      },
      error: (error) => {
        console.error('Error al cargar estadísticas:', error);
        this.cargandoStats = false;
        // Mantener valores por defecto en caso de error
        this.stats = {
          estudiantesActivos: 0,
          cursosActivos: 12,
          profesores: 0,
          graduados2024: 0
        };
      }
    });
  }

  getRoleLabel(role?: string): string {
    const labels: { [key: string]: string } = {
      'admin': 'Administrador',
      'profesor': 'Profesor',
      'student': 'Estudiante'
    };
    return role ? labels[role] : '';
  }

  abrirModalTipoUsuario(): void {
    this.mostrarModalTipoUsuario = true;
  }

  cerrarModalTipoUsuario(): void {
    this.mostrarModalTipoUsuario = false;
  }

  crearTipoUsuario(tipo: 'student' | 'profesor' | 'admin'): void {
    this.cerrarModalTipoUsuario();
    this.router.navigate(['/gestion-usuarios'], { 
      queryParams: { tipo: tipo, accion: 'crear' } 
    });
  }

  navegarA(ruta: string): void {
    this.router.navigate([ruta]);
  }
}
