import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Carrera {
  id: string;
  nombre: string;
  descripcion?: string;
  duracion_anios: number;
  estado: 'activa' | 'inactiva';
  created_at?: string;
  updated_at?: string;
}

export interface CrearCarreraRequest {
  nombre: string;
  descripcion?: string;
  duracion_anios?: number;
  estado?: 'activa' | 'inactiva';
}

@Injectable({
  providedIn: 'root'
})
export class CarrerasService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/carreras`;

  getCarreras(): Observable<Carrera[]> {
    return this.http.get<Carrera[]>(this.apiUrl);
  }

  getCarreraById(id: string): Observable<Carrera> {
    return this.http.get<Carrera>(`${this.apiUrl}/${id}`);
  }

  crearCarrera(carrera: CrearCarreraRequest): Observable<Carrera> {
    return this.http.post<Carrera>(this.apiUrl, carrera);
  }

  actualizarCarrera(id: string, carrera: CrearCarreraRequest): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, carrera);
  }

  eliminarCarrera(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
