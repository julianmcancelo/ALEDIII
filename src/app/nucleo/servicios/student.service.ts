import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Estudiante, CrearEstudianteRequest } from '../modelos/student.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class StudentService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/students`;

  getEstudiantes(): Observable<Estudiante[]> {
    return this.http.get<Estudiante[]>(this.apiUrl);
  }

  getEstudiantePorId(id: string): Observable<Estudiante> {
    return this.http.get<Estudiante>(`${this.apiUrl}/${id}`);
  }

  crearEstudiante(datosEstudiante: CrearEstudianteRequest): Observable<Estudiante> {
    const nuevoEstudiante = {
      ...datosEstudiante,
      fechaInscripcion: new Date().toISOString(),
      estado: 'activo'
    };
    return this.http.post<Estudiante>(this.apiUrl, nuevoEstudiante);
  }

  actualizarEstudiante(id: string, datosEstudiante: Partial<Estudiante>): Observable<Estudiante> {
    return this.http.put<Estudiante>(`${this.apiUrl}/${id}`, datosEstudiante);
  }

  eliminarEstudiante(id: string): Observable<Estudiante> {
    return this.http.delete<Estudiante>(`${this.apiUrl}/${id}`);
  }

  getEstudiantesPorCarrera(carrera: string): Observable<Estudiante[]> {
    return this.http.get<Estudiante[]>(`${this.apiUrl}?carrera=${carrera}`);
  }

  getEstudiantesPorEstado(estado: Estudiante['estado']): Observable<Estudiante[]> {
    return this.http.get<Estudiante[]>(`${this.apiUrl}?estado=${estado}`);
  }
}
