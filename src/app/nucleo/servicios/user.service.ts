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
import { User, CreateUserRequest, UpdateUserRequest } from '../modelos/user.model';

/**
 * @class UserService
 * @description Servicio para gestionar operaciones relacionadas con usuarios
 * Comunica con el backend para realizar operaciones CRUD en la tabla de usuarios
 */
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
  getUsuarios(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl);
  }

  /**
   * @method getUsuarioPorId
   * @description Obtiene un usuario por su ID
   * @param id Identificador único del usuario
   * @returns Observable con el usuario encontrado
   */
  getUsuarioPorId(id: string): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/${id}`);
  }

  /**
   * @method crearUsuario
   * @description Registra un nuevo usuario en el sistema
   * @param datosUsuario Datos del usuario a crear
   * @returns Observable con el usuario creado
   */
  crearUsuario(datosUsuario: CreateUserRequest): Observable<User> {
    // Realiza una petición POST al backend
    return this.http.post<User>(this.apiUrl, datosUsuario);
  }

  /**
   * @method actualizarUsuario
   * @description Actualiza los datos de un usuario existente
   * @param id Identificador del usuario
   * @param datosUsuario Datos parciales a actualizar
   * @returns Observable con el usuario actualizado
   */
  actualizarUsuario(id: string, datosUsuario: UpdateUserRequest): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/${id}`, datosUsuario);
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
  
  /**
   * @method buscarUsuarios
   * @description Busca usuarios por diferentes criterios
   * @param criterios Objeto con criterios de búsqueda
   * @returns Observable con la lista de usuarios que cumplen los criterios
   */
  buscarUsuarios(criterios: {[key: string]: any}): Observable<User[]> {
    // Construye los parámetros de búsqueda para la URL
    const params = new URLSearchParams();
    Object.keys(criterios).forEach(key => {
      params.append(key, criterios[key]);
    });
    
    return this.http.get<User[]>(`${this.apiUrl}?${params.toString()}`);
  }
}
