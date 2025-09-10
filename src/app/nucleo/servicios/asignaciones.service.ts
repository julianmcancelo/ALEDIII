import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface AsignacionProfesor {
  id: string;
  name: string;
  email: string;
  especialidad?: string;
  tipo_asignacion: 'titular' | 'adjunto' | 'auxiliar';
  fecha_asignacion: string;
}

export interface AsignacionEstudiante {
  id: string;
  name: string;
  email: string;
  dni?: string;
  carrera?: string;
  estado: 'inscrito' | 'cursando' | 'aprobado' | 'desaprobado' | 'abandono';
  fecha_inscripcion: string;
  nota_final?: number;
}

export interface AsignacionMasivaRequest {
  asignaciones: {
    materia_id: string;
    profesor_id?: string;
    estudiante_id?: string;
    tipo_asignacion?: string;
    estado?: string;
  }[];
}

export interface AsignacionMasivaResponse {
  message: string;
  exitosas: number;
  errores: string[];
}

@Injectable({
  providedIn: 'root'
})
export class AsignacionesService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/asignaciones`;

  // Obtener profesores asignados a una materia
  getProfesoresByMateria(materiaId: string): Observable<AsignacionProfesor[]> {
    return this.http.get<AsignacionProfesor[]>(`${this.apiUrl}?materia_id=${materiaId}&tipo=profesores`);
  }

  // Obtener estudiantes asignados a una materia
  getEstudiantesByMateria(materiaId: string): Observable<AsignacionEstudiante[]> {
    return this.http.get<AsignacionEstudiante[]>(`${this.apiUrl}?materia_id=${materiaId}&tipo=estudiantes`);
  }

  // Asignar un profesor a una materia
  asignarProfesor(materiaId: string, profesorId: string, tipoAsignacion: string = 'titular'): Observable<any> {
    return this.http.post(`${this.apiUrl}/profesor`, {
      materia_id: materiaId,
      profesor_id: profesorId,
      tipo_asignacion: tipoAsignacion
    });
  }

  // Asignar un estudiante a una materia
  asignarEstudiante(materiaId: string, estudianteId: string, estado: string = 'inscrito'): Observable<any> {
    return this.http.post(`${this.apiUrl}/estudiante`, {
      materia_id: materiaId,
      estudiante_id: estudianteId,
      estado: estado
    });
  }

  // Asignación masiva de profesores
  asignacionMasivaProfesores(asignaciones: AsignacionMasivaRequest): Observable<AsignacionMasivaResponse> {
    return this.http.post<AsignacionMasivaResponse>(`${this.apiUrl}/profesor/bulk`, asignaciones);
  }

  // Asignación masiva de estudiantes
  asignacionMasivaEstudiantes(asignaciones: AsignacionMasivaRequest): Observable<AsignacionMasivaResponse> {
    return this.http.post<AsignacionMasivaResponse>(`${this.apiUrl}/estudiante/bulk`, asignaciones);
  }

  // Remover profesor de una materia
  removerProfesor(materiaId: string, profesorId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/profesor`, {
      body: { materia_id: materiaId, profesor_id: profesorId }
    });
  }

  // Remover estudiante de una materia
  removerEstudiante(materiaId: string, estudianteId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/estudiante`, {
      body: { materia_id: materiaId, estudiante_id: estudianteId }
    });
  }
}
