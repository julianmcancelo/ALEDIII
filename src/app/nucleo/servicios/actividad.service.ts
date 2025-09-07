import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { Actividad } from '../modelos/actividad.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ActividadService {
  private apiUrl = `${environment.apiUrl}/actividades.php`;

  constructor(private http: HttpClient) { }

  getActividadesRecientes(limit: number = 5): Observable<Actividad[]> {
    // Conectar al API real
    return this.http.get<Actividad[]>(`${this.apiUrl}?limit=${limit}`)
      .pipe(
        tap(data => console.log('Actividades obtenidas:', data.length)),
        map(data => {
          // Asegurar que las fechas son objetos Date
          return data.map(act => ({
            ...act,
            fecha: new Date(act.fecha)
          }));
        }),
        catchError(error => {
          console.error('Error al obtener actividades:', error);
          // Si falla, devolver datos de ejemplo
          return of(this.getMockActividades());
        })
      );
  }
  
  registrarActividad(actividad: Omit<Actividad, 'id' | 'fecha'>): Observable<Actividad> {
    const nuevaActividad = {
      ...actividad,
      fecha: new Date().toISOString() // Formato ISO para la API
    };
    
    return this.http.post<Actividad>(this.apiUrl, nuevaActividad)
      .pipe(
        tap(data => console.log('Actividad registrada:', data)),
        map(data => ({
          ...data,
          fecha: new Date(data.fecha) // Convertir a Date
        })),
        catchError(error => {
          console.error('Error al registrar actividad:', error);
          // Si falla, simular respuesta exitosa
          return of({
            ...nuevaActividad,
            id: Math.floor(Math.random() * 1000),
            fecha: new Date()
          } as Actividad);
        })
      );
  }

  private getMockActividades(): Actividad[] {
    return [
      {
        id: 1,
        tipo: 'estudiante',
        mensaje: 'Se registraron 5 nuevos alumnos',
        fecha: new Date(new Date().getTime() - 2 * 60 * 60 * 1000) // 2 horas atrás
      },
      {
        id: 2,
        tipo: 'sistema',
        mensaje: 'Sistema actualizado a versión 2.5.0',
        fecha: new Date(new Date().getTime() - 24 * 60 * 60 * 1000) // Ayer
      },
      {
        id: 3,
        tipo: 'academico',
        mensaje: 'Inicio del período académico 2025',
        fecha: new Date(new Date().getTime() - 2 * 24 * 60 * 60 * 1000) // 2 días atrás
      }
    ];
  }
}
