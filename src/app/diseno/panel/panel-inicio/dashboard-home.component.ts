import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService, User } from '../../../nucleo/servicios/auth.service';
import { DashboardService, DashboardStats } from '../../../nucleo/servicios/dashboard.service';

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

  constructor(
    private authService: AuthService,
    private dashboardService: DashboardService
  ) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });

    this.cargarEstadisticas();
  }

  cargarEstadisticas(): void {
    this.cargandoStats = true;
    this.dashboardService.getEstadisticas().subscribe({
      next: (estadisticas) => {
        this.stats = estadisticas;
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
}
