import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Materia {
  id: string;
  nombre: string;
  codigo: string;
  descripcion?: string;
  carrera_id: string;
  carrera_nombre?: string;
  profesor_id?: string;
  profesor_nombre?: string;
  profesor_email?: string;
  anio: number;
  cuatrimestre: '1' | '2' | 'anual';
  horas_semanales: number;
  estado: 'activa' | 'inactiva';
  created_at?: string;
  updated_at?: string;
}

export interface CrearMateriaRequest {
  nombre: string;
  codigo: string;
  descripcion?: string;
  carrera_id: string;
  profesor_id?: string;
  anio: number;
  cuatrimestre?: '1' | '2' | 'anual';
  horas_semanales?: number;
  estado?: 'activa' | 'inactiva';
}

@Injectable({
  providedIn: 'root'
})
export class MateriasService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/materias`;

  getMaterias(): Observable<Materia[]> {
    return this.http.get<Materia[]>(this.apiUrl);
  }

  getMateriasByCarrera(carreraId: string): Observable<Materia[]> {
    return this.http.get<Materia[]>(`${this.apiUrl}?carrera_id=${carreraId}`);
  }

  getMateriasByAnio(carreraId: string, anio: number): Observable<Materia[]> {
    return this.http.get<Materia[]>(`${this.apiUrl}?carrera_id=${carreraId}&anio=${anio}`);
  }

  getMateriaById(id: string): Observable<Materia> {
    return this.http.get<Materia>(`${this.apiUrl}/${id}`);
  }

  crearMateria(materia: CrearMateriaRequest): Observable<Materia> {
    return this.http.post<Materia>(this.apiUrl, materia);
  }

  actualizarMateria(id: string, materia: CrearMateriaRequest): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, materia);
  }

  eliminarMateria(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
