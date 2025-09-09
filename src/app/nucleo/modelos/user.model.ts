/**
 * @file user.model.ts
 * @description Modelo de usuario basado en la estructura de la tabla MySQL
 * Define la interfaz que representa un usuario en el sistema
 * 
 * TP Final Algoritmos y Estructuras de Datos III - 2025
 * Alumnos: CANCELO JULIAN - NICOLAS OTERO (Curso 3ra 1RA)
 * Profesor: Sebastian Saldivar
 */

/**
 * Tipo para los roles de usuario
 * Basado en la enumeración de la tabla de MySQL
 */
export type UserRole = 'admin' | 'student' | 'profesor';

/**
 * Tipo para los departamentos administrativos
 * Basado en la enumeración de la tabla de MySQL
 */
export type Departamento = 'Dirección' | 'Secretaría' | 'Administración' | 'Sistemas';

/**
 * @interface User
 * @description Interfaz que refleja la estructura de la tabla usuarios en MySQL
 */
export interface User {
  id: string;               // ID único del usuario (varchar(36) en MySQL)
  email: string;            // Email único del usuario (varchar(255) en MySQL)
  name: string;             // Nombre completo (varchar(255) en MySQL)
  role: UserRole;           // Rol: admin, student o profesor (enum en MySQL)
  password_hash?: string;   // Hash de contraseña (varchar(255) en MySQL, solo backend)
  
  // Campos opcionales dependiendo del rol
  dni?: string;             // Documento de identidad (varchar(20) en MySQL)
  legajo?: string;          // Número de legajo/matrícula (varchar(20) en MySQL)
  carrera?: string;         // Carrera del estudiante (varchar(100) en MySQL)
  especialidad?: string;    // Especialidad del profesor (varchar(100) en MySQL)
  telefono?: string;        // Teléfono de contacto (varchar(20) en MySQL)
  departamento?: Departamento; // Departamento administrativo (enum en MySQL)
  
  // Timestamps automáticos
  created_at?: string;      // Fecha de creación (timestamp en MySQL)
  updated_at?: string;      // Fecha de última actualización (timestamp en MySQL)
}

/**
 * @interface CreateUserRequest
 * @description Datos necesarios para crear un nuevo usuario (sin ID)
 */
export interface CreateUserRequest {
  email: string;
  name: string;
  role: UserRole;
  password: string;         // Contraseña sin hashear (para el frontend)
  
  // Campos opcionales dependiendo del rol
  dni?: string;
  legajo?: string;
  carrera?: string;
  especialidad?: string;
  telefono?: string;
  departamento?: Departamento;
}

/**
 * @interface UpdateUserRequest
 * @description Datos parciales para actualizar un usuario existente
 */
export interface UpdateUserRequest {
  email?: string;
  name?: string;
  role?: UserRole;
  password?: string;        // Solo se incluye si se va a cambiar la contraseña
  
  // Campos opcionales dependiendo del rol
  dni?: string;
  legajo?: string;
  carrera?: string;
  especialidad?: string;
  telefono?: string;
  departamento?: Departamento;
}
