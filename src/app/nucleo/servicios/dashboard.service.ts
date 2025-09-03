import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, map, catchError, of } from 'rxjs';
import { environment } from '../../entornos/environment';

export interface DashboardStats {
  estudiantesActivos: number;
  cursosActivos: number;
  profesores: number;
  graduados2024: number;
}

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  getEstadisticas(): Observable<DashboardStats> {
    return forkJoin({
      estudiantes: this.http.get<any[]>(`${this.apiUrl}/students`).pipe(
        catchError(() => of([]))
      ),
      usuarios: this.http.get<any[]>(`${this.apiUrl}/users`).pipe(
        catchError(() => of([]))
      )
    }).pipe(
      map(({ estudiantes, usuarios }) => {
        // Contar estudiantes activos
        const estudiantesActivos = (estudiantes as any[]).filter((est: any) => est.estado === 'activo').length;
        
        // Contar graduados en 2024
        const graduados2024 = (estudiantes as any[]).filter((est: any) => {
          if (est.estado === 'graduado' && est.fecha_graduacion) {
            const fechaGraduacion = new Date(est.fecha_graduacion);
            return fechaGraduacion.getFullYear() === 2024;
          }
          return false;
        }).length;

        // Contar profesores
        const profesores = (usuarios as any[]).filter((user: any) => user.role === 'profesor').length;

        // Por ahora, cursos activos será un número fijo hasta que tengamos tabla de cursos
        const cursosActivos = 12; // Placeholder

        return {
          estudiantesActivos,
          cursosActivos,
          profesores,
          graduados2024
        };
      }),
      catchError((error: any) => {
        console.error('Error en getEstadisticas:', error);
        return of({
          estudiantesActivos: 0,
          cursosActivos: 12,
          profesores: 0,
          graduados2024: 0
        });
      })
    );
  }
}
