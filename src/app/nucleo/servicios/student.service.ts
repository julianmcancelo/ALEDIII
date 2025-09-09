/**
 * @file student.service.ts
 * @description Servicio para gestionar operaciones relacionadas con estudiantes
 * Proporciona métodos para crear, leer, actualizar y eliminar estudiantes (CRUD)
 * 
 * TP Final Algoritmos y Estructuras de Datos III - 2025
 * Alumnos: CANCELO JULIAN - NICOLAS OTERO (Curso 3ra 1RA)
 * Profesor: Sebastian Saldivar
 */
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Estudiante, CrearEstudianteRequest } from '../modelos/student.model';
import { environment } from '../../../environments/environment';

/**
 * @class StudentService
 * @description Servicio para la gestión de estudiantes
 * Centraliza todas las operaciones relacionadas con el mantenimiento
 * de la información de estudiantes en el sistema académico
 */
@Injectable({
  providedIn: 'root'  // Disponible en toda la aplicación como singleton
})
export class StudentService {
  /**
   * @property http
   * @description Cliente HTTP para realizar peticiones al backend
   * Utiliza la API moderna de inyección de dependencias de Angular
   */
  private http = inject(HttpClient);
  
  /**
   * @property apiUrl
   * @description URL base para las operaciones con estudiantes
   * Se construye usando la configuración del entorno
   */
  private apiUrl = `${environment.apiUrl}/students`;

  /**
   * @method getEstudiantes
   * @description Obtiene la lista completa de estudiantes
   * @returns Observable con array de estudiantes
   */
  getEstudiantes(): Observable<Estudiante[]> {
    return this.http.get<Estudiante[]>(this.apiUrl);
  }

  /**
   * @method getEstudiantePorId
   * @description Obtiene los detalles de un estudiante específico por su ID
   * @param id Identificador único del estudiante
   * @returns Observable con los datos del estudiante
   */
  getEstudiantePorId(id: string): Observable<Estudiante> {
    return this.http.get<Estudiante>(`${this.apiUrl}/${id}`);
  }

  /**
   * @method crearEstudiante
   * @description Crea un nuevo registro de estudiante en el sistema
   * @param datosEstudiante Datos del estudiante a crear
   * @returns Observable con los datos del estudiante creado
   */
  crearEstudiante(datosEstudiante: CrearEstudianteRequest): Observable<Estudiante> {
    // Añadimos datos automáticos: fecha de inscripción y estado inicial
    const nuevoEstudiante = {
      ...datosEstudiante,
      fechaInscripcion: new Date().toISOString(), // Fecha actual formateada
      estado: 'activo'                           // Estado predeterminado
    };
    return this.http.post<Estudiante>(this.apiUrl, nuevoEstudiante);
  }

  /**
   * @method actualizarEstudiante
   * @description Actualiza la información de un estudiante existente
   * @param id Identificador del estudiante a actualizar
   * @param datosEstudiante Datos parciales o completos a modificar
   * @returns Observable con los datos actualizados del estudiante
   */
  actualizarEstudiante(id: string, datosEstudiante: Partial<Estudiante>): Observable<Estudiante> {
    return this.http.put<Estudiante>(`${this.apiUrl}/${id}`, datosEstudiante);
  }

  /**
   * @method eliminarEstudiante
   * @description Elimina un estudiante del sistema
   * @param id Identificador del estudiante a eliminar
   * @returns Observable con los datos del estudiante eliminado
   */
  eliminarEstudiante(id: string): Observable<Estudiante> {
    return this.http.delete<Estudiante>(`${this.apiUrl}/${id}`);
  }

  /**
   * @method getEstudiantesPorCarrera
   * @description Filtra estudiantes por una carrera específica
   * @param carrera Nombre de la carrera para filtrar estudiantes
   * @returns Observable con array de estudiantes de la carrera especificada
   */
  getEstudiantesPorCarrera(carrera: string): Observable<Estudiante[]> {
    return this.http.get<Estudiante[]>(`${this.apiUrl}?carrera=${carrera}`);
  }

  /**
   * @method getEstudiantesPorEstado
   * @description Filtra estudiantes por su estado académico
   * @param estado Estado del estudiante (activo, graduado, suspendido, etc.)
   * @returns Observable con array de estudiantes que tienen el estado especificado
   */
  getEstudiantesPorEstado(estado: Estudiante['estado']): Observable<Estudiante[]> {
    return this.http.get<Estudiante[]>(`${this.apiUrl}?estado=${estado}`);
  }
  
  /**
   * @note Servicio implementado como parte del TP Final
   * Algoritmos y Estructuras de Datos III - 2025
   * Alumnos: CANCELO JULIAN - NICOLAS OTERO (Curso 3ra 1RA)
   */
}
