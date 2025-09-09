import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Profesor {
  id: string;
  name: string;
  email: string;
  especialidad?: string;
  departamento?: string;
  created_at: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProfesoresService {
  private apiUrl = `${environment.apiUrl}/profesores`;

  constructor(private http: HttpClient) {}

  getProfesores(): Observable<Profesor[]> {
    return this.http.get<Profesor[]>(this.apiUrl);
  }

  getProfesorById(id: string): Observable<Profesor> {
    return this.http.get<Profesor>(`${this.apiUrl}/${id}`);
  }

  getMateriasByProfesor(profesorId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/${profesorId}?materias=true`);
  }
}
