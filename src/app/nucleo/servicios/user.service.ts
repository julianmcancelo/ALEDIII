import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Usuario {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'student' | 'profesor';
  password_hash?: string;
  dni?: string;
  legajo?: string;
  carrera_id?: string;
  carrera_nombre?: string;
  telefono?: string;
  departamento?: 'Dirección' | 'Secretaría' | 'Administración' | 'Sistemas';
  created_at?: string;
  updated_at?: string;
  apellidos?: string;
  fechaNacimiento?: string;
  fechaInscripcion?: string;
  estado?: 'activo' | 'inactivo' | 'graduado';
  calle?: string;
  ciudad?: string;
  provincia?: string;
  codigoPostal?: string;
  contacto_emergencia_nombre?: string;
  contacto_emergencia_telefono?: string;
  contacto_emergencia_parentesco?: string;
}

export interface CrearUsuarioRequest {
  email: string;
  name: string;
  role: 'admin' | 'student' | 'profesor';
  password: string;
  dni?: string;
  legajo?: string;
  carrera_id?: string;
  telefono?: string;
  departamento?: 'Dirección' | 'Secretaría' | 'Administración' | 'Sistemas';
  apellidos?: string;
  fechaNacimiento?: string;
  fechaInscripcion?: string;
  estado?: 'activo' | 'inactivo' | 'graduado';
  calle?: string;
  ciudad?: string;
  provincia?: string;
  codigoPostal?: string;
  contacto_emergencia_nombre?: string;
  contacto_emergencia_telefono?: string;
  contacto_emergencia_parentesco?: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/users`;

  getUsuarios(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(this.apiUrl);
  }

  crearUsuario(datosUsuario: CrearUsuarioRequest): Observable<Usuario> {
    return this.http.post<Usuario>(this.apiUrl, datosUsuario);
  }

  eliminarUsuario(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  updateUser(id: string, datosUsuario: Partial<CrearUsuarioRequest>): Observable<Usuario> {
    return this.http.put<Usuario>(`${this.apiUrl}/${id}`, datosUsuario);
  }
}
