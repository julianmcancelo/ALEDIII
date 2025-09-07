/**
 * @file auth.service.ts
 * @description Servicio de autenticación que maneja el inicio de sesión, cierre de sesión y
 * gestión del usuario actual en la aplicación
 */
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map, catchError, tap, first } from 'rxjs/operators';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';

/**
 * @interface User
 * @description Interfaz que define la estructura de datos de un usuario en la aplicación
 * Contiene información básica necesaria para la autenticación y autorización
 */
export interface User {
  id: string;         // Identificador único del usuario
  email: string;      // Correo electrónico (usado para login)
  name: string;       // Nombre completo del usuario
  role: 'admin' | 'student' | 'profesor';  // Rol del usuario (determina permisos)
  password?: string;  // Contraseña (opcional, solo usado en el proceso de login)
}

/**
 * @class AuthService
 * @description Servicio que gestiona la autenticación y autorización de usuarios
 * Proporciona métodos para iniciar sesión, cerrar sesión y verificar roles del usuario
 */
@Injectable({
  providedIn: 'root'  // El servicio está disponible en toda la aplicación
})
export class AuthService {
  // Inyección de dependencias usando el patrón inject (Angular 14+)
  private http = inject(HttpClient);  // Para realizar peticiones HTTP
  private router = inject(Router);    // Para la navegación programática
  
  // URL de la API para operaciones relacionadas con usuarios
  private apiUrl = `${environment.apiUrl}/users`;

  // Subject que mantiene el estado del usuario actual
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  
  // Subject para controlar si hay usuarios en el sistema
  private hasUsersSubject = new BehaviorSubject<boolean | null>(null);
  
  // Observable público que otros componentes pueden suscribirse para obtener actualizaciones del usuario
  public currentUser$ = this.currentUserSubject.asObservable();
  
  // Observable público para verificar si el sistema tiene usuarios
  public hasUsers$ = this.hasUsersSubject.asObservable();

  /**
   * @constructor
   * @description Inicializa el servicio de autenticación y recupera el usuario guardado en localStorage
   * si existe, para mantener la sesión activa después de refrescar la página
   */
  constructor() {
    // Intenta recuperar el usuario del almacenamiento local (persistencia de sesión)
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      // Si existe un usuario guardado, lo establece como usuario actual
      this.currentUserSubject.next(JSON.parse(savedUser));
    }
    
    // Verificar si hay usuarios en el sistema
    this.checkIfUsersExist();
  }

  /**
   * @method login
   * @description Autentica al usuario con email y contraseña contra la API
   * @param {string} email - Email del usuario
   * @param {string} password - Contraseña del usuario
   * @returns {Observable<boolean>} Observable que emite true si el login es exitoso, false en caso contrario
   */
  login(email: string, password: string): Observable<boolean> {
    // URL específica para login que verifica la contraseña con hash
    const loginUrl = `${environment.apiUrl}/users/login`;
    
    // Enviar credenciales en el cuerpo de la petición POST
    return this.http.post<any>(loginUrl, { email, password }).pipe(
      map(user => {
        if (user && user.id) {
          // Si obtenemos un usuario válido
          // Actualizamos el estado del usuario actual
          this.currentUserSubject.next(user);
          // Guardamos el usuario en localStorage para persistencia
          localStorage.setItem('currentUser', JSON.stringify(user));
          return true;  // Login exitoso
        } else {
          return false;  // No se encontró usuario con esas credenciales
        }
      }),
      catchError(error => {
        // Manejo de errores en la petición HTTP
        console.error('Login failed:', error);
        return of(false);  // Devolvemos false en caso de error
      })
    );
  }

  /**
   * @method logout
   * @description Cierra la sesión del usuario actual, elimina datos del localStorage
   * y redirecciona a la página de login
   */
  logout(): void {
    // Eliminamos el usuario actual del estado
    this.currentUserSubject.next(null);
    // Eliminamos el usuario del almacenamiento local
    localStorage.removeItem('currentUser');
    // Redireccionamos al usuario a la página de login
    this.router.navigate(['/auth/login']);
  }

  /**
   * @method getCurrentUser
   * @description Obtiene el usuario actual directamente (valor sincrónico)
   * @returns {User | null} El usuario actual o null si no hay sesión
   */
  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  /**
   * @method isLoggedIn
   * @description Verifica si hay un usuario con sesión activa
   * @returns {boolean} true si hay un usuario autenticado, false en caso contrario
   */
  isLoggedIn(): boolean {
    return this.currentUserSubject.value !== null;
  }

  /**
   * @method hasRole
   * @description Verifica si el usuario actual tiene un rol específico
   * @param {string} role - Rol a verificar
   * @returns {boolean} true si el usuario tiene el rol especificado, false en caso contrario
   */
  hasRole(role: string): boolean {
    const user = this.getCurrentUser();
    return user ? user.role === role : false;
  }

  /**
   * @method isAdmin
   * @description Verifica si el usuario actual tiene rol de administrador
   * @returns {boolean} true si el usuario es administrador, false en caso contrario
   */
  isAdmin(): boolean {
    return this.hasRole('admin');
  }

  /**
   * @method isTeacher
   * @description Verifica si el usuario actual tiene rol de profesor
   * @returns {boolean} true si el usuario es profesor, false en caso contrario
   */
  isTeacher(): boolean {
    return this.hasRole('profesor');
  }

  /**
   * @method isStudent
   * @description Verifica si el usuario actual tiene rol de estudiante
   * @returns {boolean} true si el usuario es estudiante, false en caso contrario
   */
  isStudent(): boolean {
    return this.hasRole('student');
  }
  
  /**
   * @method checkIfUsersExist
   * @description Verifica si existen usuarios en el sistema
   * @returns {Observable<boolean>} Observable que emite true si hay usuarios, false si no hay ninguno
   */
  checkIfUsersExist(): Observable<boolean> {
    // Si ya conocemos el estado, devolvemos el valor actual
    if (this.hasUsersSubject.value !== null) {
      return of(this.hasUsersSubject.value);
    }
    
    // Si no lo conocemos, hacemos una consulta a la API
    return this.http.get<User[]>(`${this.apiUrl}`).pipe(
      map(users => {
        const hasUsers = users && users.length > 0;
        this.hasUsersSubject.next(hasUsers);
        return hasUsers;
      }),
      catchError(error => {
        console.error('Error al verificar usuarios:', error);
        // Si hay error, asumimos que no hay usuarios (sistema nuevo o error de API)
        this.hasUsersSubject.next(false);
        return of(false);
      }),
      first() // Completamos el Observable después de la primera emisión
    );
  }
  
  /**
   * @method createInitialAdmin
   * @description Crea el primer usuario administrador del sistema
   * @param {string} name - Nombre del administrador
   * @param {string} email - Email del administrador
   * @param {string} password - Contraseña del administrador
   * @returns {Observable<User>} Observable que emite el usuario creado
   */
  createInitialAdmin(name: string, email: string, password: string): Observable<User> {
    const adminUser: Omit<User, 'id'> = {
      name,
      email,
      password,
      role: 'admin'
    };
    
    return this.http.post<User>(this.apiUrl, adminUser).pipe(
      tap(newUser => {
        // Actualizamos el estado para indicar que ya hay usuarios
        this.hasUsersSubject.next(true);
        // También iniciamos sesión automáticamente
        this.currentUserSubject.next(newUser);
        localStorage.setItem('currentUser', JSON.stringify(newUser));
      }),
      catchError(error => {
        console.error('Error al crear administrador inicial:', error);
        throw error;
      })
    );
  }
}
