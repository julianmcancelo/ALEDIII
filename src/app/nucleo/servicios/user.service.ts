/**
 * @file user.service.ts
 * @description Servicio para gestionar operaciones CRUD de usuarios
 * Basado en la estructura de tabla MySQL del sistema
 * 
 * TP Final Algoritmos y Estructuras de Datos III - 2025
 * Alumnos: CANCELO JULIAN - NICOLAS OTERO (Curso 3ra 1RA)
 * Profesor: Sebastian Saldivar
 */
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Usuario {
  id: string;
  email: string;
  name: string;
  apellidos?: string;
  role: 'admin' | 'student' | 'profesor';
  dni?: string;
  legajo?: string;
  carrera?: string;
  carrera_id?: string;
  carrera_nombre?: string;
  telefono?: string;
  fechaNacimiento?: string;
  fechaInscripcion?: string;
  estado?: string;
  calle?: string;
  ciudad?: string;
  provincia?: string;
  codigoPostal?: string;
  contacto_emergencia_nombre?: string;
  contacto_emergencia_telefono?: string;
  contacto_emergencia_parentesco?: string;
  departamento?: string;
  created_at?: string;
}

export interface CrearUsuarioRequest {
  email: string;
  name: string;
  apellidos?: string;
  role: 'admin' | 'student' | 'profesor';
  password: string;
  dni?: string;
  legajo?: string;
  carrera?: string;
  carrera_id?: string;
  telefono?: string;
  fechaNacimiento?: string;
  fechaInscripcion?: string;
  estado?: string;
  calle?: string;
  ciudad?: string;
  provincia?: string;
  codigoPostal?: string;
  contacto_emergencia_nombre?: string;
  contacto_emergencia_telefono?: string;
  contacto_emergencia_parentesco?: string;
  departamento?: string;
  especialidad?: string;
}

export interface UpdateUserRequest {
  email?: string;
  name?: string;
  apellidos?: string;
  dni?: string;
  legajo?: string;
  carrera?: string;
  telefono?: string;
  fechaNacimiento?: string;
  fechaInscripcion?: string;
  estado?: string;
  calle?: string;
  ciudad?: string;
  provincia?: string;
  codigoPostal?: string;
  contacto_emergencia_nombre?: string;
  contacto_emergencia_telefono?: string;
  contacto_emergencia_parentesco?: string;
}

@Injectable({
  providedIn: 'root' // Disponible en toda la aplicación
})
export class UserService {
  // Inyección de dependencias
  private http = inject(HttpClient);
  
  // URL de la API para usuarios
  private apiUrl = `${environment.apiUrl}/users`;

  /**
   * @method getUsuarios
   * @description Obtiene todos los usuarios del sistema
   * @returns Observable con la lista de usuarios
   */
  getUsuarios(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(this.apiUrl);
  }

  /**
   * @method getUsuarioPorId
   * @description Obtiene un usuario por su ID
   * @param id Identificador único del usuario
   * @returns Observable con el usuario encontrado
   */
  getUsuarioPorId(id: string): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.apiUrl}/${id}`);
  }

  /**
   * @method crearUsuario
   * @description Registra un nuevo usuario en el sistema
   * @param datosUsuario Datos del usuario a crear
   * @returns Observable con el usuario creado
   */
  crearUsuario(datosUsuario: CrearUsuarioRequest): Observable<Usuario> {
    // Realiza una petición POST al backend
    return this.http.post<Usuario>(this.apiUrl, datosUsuario);
  }

  /**
   * @method actualizarUsuario
   * @description Actualiza los datos de un usuario existente
   * @param id Identificador del usuario
   * @param datosUsuario Datos parciales a actualizar
   * @returns Observable con el usuario actualizado
   */
  actualizarUsuario(id: string, datosUsuario: UpdateUserRequest): Observable<Usuario> {
    return this.http.put<Usuario>(`${this.apiUrl}/${id}`, datosUsuario);
  }

  /**
   * @method updateUser
   * @description Alias para actualizarUsuario (compatibilidad)
   * @param id Identificador del usuario
   * @param datosUsuario Datos parciales a actualizar
   * @returns Observable con el usuario actualizado
   */
  updateUser(id: string, datosUsuario: UpdateUserRequest): Observable<Usuario> {
    return this.actualizarUsuario(id, datosUsuario);
  }

  /**
   * @method eliminarUsuario
   * @description Elimina un usuario del sistema
   * @param id Identificador del usuario a eliminar
   * @returns Observable con la respuesta del servidor
   */
  eliminarUsuario(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
