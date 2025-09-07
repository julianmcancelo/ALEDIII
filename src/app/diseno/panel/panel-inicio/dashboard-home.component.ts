import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService, User } from '../../../nucleo/servicios/auth.service';
import { DashboardService, DashboardStats } from '../../../nucleo/servicios/dashboard.service';
import { ActividadService } from '../../../nucleo/servicios/actividad.service';
import { Actividad } from '../../../nucleo/modelos/actividad.model';

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
  actividadesRecientes: Actividad[] = [];
  cargandoActividades = true;

  constructor(
    private authService: AuthService,
    private dashboardService: DashboardService,
    private actividadService: ActividadService
  ) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });

    this.cargarEstadisticas();
    this.cargarActividadesRecientes();
  }
  
  cargarActividadesRecientes(): void {
    this.cargandoActividades = true;
    this.actividadService.getActividadesRecientes().subscribe({
      next: (actividades) => {
        this.actividadesRecientes = actividades;
        this.cargandoActividades = false;
      },
      error: (error) => {
        console.error('Error al cargar actividades recientes:', error);
        this.cargandoActividades = false;
      }
    });
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
  
  formatearFechaActividad(fecha: Date): string {
    const ahora = new Date();
    const fechaActividad = new Date(fecha);
    const diferenciaMilisegundos = ahora.getTime() - fechaActividad.getTime();
    const diferenciaDias = Math.floor(diferenciaMilisegundos / (1000 * 3600 * 24));
    const diferenciaHoras = Math.floor(diferenciaMilisegundos / (1000 * 3600));
    
    if (diferenciaDias > 0) {
      return diferenciaDias === 1 ? 'Ayer' : `${diferenciaDias} días atrás`;
    } else if (diferenciaHoras > 0) {
      return diferenciaHoras === 1 ? 'Hace 1 hora' : `Hace ${diferenciaHoras} horas`;
    } else {
      const diferenciaMinutos = Math.floor(diferenciaMilisegundos / (1000 * 60));
      return diferenciaMinutos <= 1 ? 'Hace un momento' : `Hace ${diferenciaMinutos} minutos`;
    }
  }
  
  getIconoActividad(tipo: string): { clase: string, icono: string } {
    switch (tipo) {
      case 'estudiante':
        return { clase: 'bg-blue-100 text-blue-600', icono: 'M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z' };
      case 'sistema':
        return { clase: 'bg-green-100 text-green-600', icono: 'M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z' };
      case 'academico':
        return { clase: 'bg-amber-100 text-amber-600', icono: 'M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z' };
      case 'usuario':
        return { clase: 'bg-purple-100 text-purple-600', icono: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z' };
      default:
        return { clase: 'bg-gray-100 text-gray-600', icono: 'M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' };
    }
  }
}
