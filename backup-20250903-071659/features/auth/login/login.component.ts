// TP Final - Algoritmos y Estructuras de Datos III - 2025
// Módulo de autenticación para sistema de gestión académica
// Alumno: Curso 3ra 1RA - CANCELO JULIAN- NICOLAS OTERO
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';
import Swal from 'sweetalert2'; // Librería para mostrar alertas bonitas

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="min-h-screen bg-gradient-to-b from-blue-900 via-blue-700 to-indigo-800 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <!-- Botón flotante para credenciales de demo -->
      <div class="fixed top-4 right-4 z-10">
        <button type="button" (click)="alternarCredenciales()" class="bg-white text-blue-700 rounded-full p-3 shadow-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H5v-2H3v-2H1v-4a6 6 0 016-6h4a6 6 0 016 6z" />
          </svg>
        </button>

        <!-- Panel de credenciales -->
        <div *ngIf="mostrarCredenciales" class="absolute top-14 right-0 w-72 p-4 bg-white rounded-lg shadow-xl border border-gray-200 animate__animated animate__fadeIn">
          <h4 class="text-sm font-medium text-gray-800 mb-2">Usuarios de Prueba</h4>
          <ul class="space-y-2 text-xs text-gray-600">
            <li *ngFor="let usuario of usuariosDemo" class="border-b pb-1 last:border-b-0 hover:bg-blue-50 p-1 rounded transition-colors duration-200">
              <p><strong>Rol:</strong> <span class="font-mono bg-blue-100 px-1 rounded">{{ usuario.role }}</span></p>
              <p><strong>Email:</strong> <span class="font-mono">{{ usuario.email }}</span></p>
              <p><strong>Clave:</strong> <span class="font-mono">{{ usuario.password }}</span></p>
            </li>
          </ul>
        </div>
      </div>

      <div class="sm:mx-auto sm:w-full sm:max-w-md">
        <div class="bg-white p-3 rounded-full inline-block mx-auto shadow-lg">
          <img class="h-16 w-auto" src="/assets/logo.png" alt="Instituto Beltrán">
        </div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-white">
          Instituto Tecnológico Beltrán
        </h2>
        <p class="mt-2 text-center text-base text-blue-100">
          Bienvenido al portal de gestión académica
        </p>
      </div>

      <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div class="bg-white py-8 px-6 shadow-2xl rounded-xl sm:px-10 border-t-4 border-blue-500">
          <form [formGroup]="formularioLogin" (ngSubmit)="iniciarSesion()" class="space-y-6">
            <div>
              <label for="email" class="block text-sm font-medium text-gray-700"> Email </label>
              <div class="mt-1 relative rounded-md shadow-sm">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg class="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <input 
                  id="email" 
                  formControlName="email" 
                  type="email" 
                  placeholder="ejemplo@ibeltran.com.ar"
                  required 
                  class="appearance-none block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-colors duration-200">
              </div>
              <p *ngIf="formularioLogin.get('email')?.invalid && formularioLogin.get('email')?.touched" class="mt-1 text-xs text-red-600">Por favor, ingresa un email válido</p>
            </div>

            <div>
              <label for="password" class="block text-sm font-medium text-gray-700"> Contraseña </label>
              <div class="mt-1 relative rounded-md shadow-sm">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg class="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <input 
                  id="password" 
                  formControlName="password" 
                  [type]="ocultarContrasena ? 'password' : 'text'"
                  required 
                  class="appearance-none block w-full pl-10 pr-12 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-colors duration-200">
                <div class="absolute inset-y-0 right-0 pr-3 flex items-center">
                  <button type="button" class="text-gray-400 hover:text-gray-500 focus:outline-none" (click)="ocultarContrasena = !ocultarContrasena">
                    <svg *ngIf="ocultarContrasena" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    <svg *ngIf="!ocultarContrasena" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  </button>
                </div>
              </div>
              <p *ngIf="formularioLogin.get('password')?.invalid && formularioLogin.get('password')?.touched" class="mt-1 text-xs text-red-600">La contraseña debe tener al menos 6 caracteres</p>
            </div>

            <div class="flex items-center justify-between">
              <div class="flex items-center">
                <input id="remember-me" name="remember-me" type="checkbox" class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded">
                <label for="remember-me" class="ml-2 block text-sm text-gray-900"> Recordarme </label>
              </div>
            </div>

            <div>
              <button 
                type="submit" 
                [disabled]="formularioLogin.invalid || cargando"
                class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200">
                <!-- Uso condicional de Angular 17 con sintaxis @if -->
                @if (!cargando) {
                  <span>Iniciar Sesión</span>
                } @else {
                  <span class="flex items-center">
                    <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Procesando...
                  </span>
                }
              </button>
            </div>
          </form>

        </div>
      </div>
    </div>
  `,
  styles: []
})
export class LoginComponent {
  // Formulario reactivo para validación de campos
  formularioLogin: FormGroup;
  
  // Variables de control de la interfaz
  ocultarContrasena = true; // Toggle para mostrar/ocultar contraseña
  cargando = false;         // Estado de carga durante autenticación
  mostrarCredenciales = false; // Control para panel de credenciales demo

  // Array de usuarios de prueba para demostración
  // NOTA: En producción estos usuarios no deberían estar hardcodeados
  // Los incluyo para facilitar las pruebas durante el desarrollo
  usuariosDemo = [
    { email: 'admin@ibeltran.com.ar', password: 'AdminPassword2025!', role: 'Administrador' },
    { email: 'sebastian.saldivar@ibeltran.com.ar', password: 'ProfeSaldivar2025!', role: 'Profesor' },
    { email: 'jose.casalnovo@ibeltran.com.ar', password: 'ProfeCasalnovo2025!', role: 'Profesor' },
    { email: 'gabriela.tajes@ibeltran.com.ar', password: 'ProfeTajes2025!', role: 'Profesor' },
    { email: 'sebastian.ceballos@ibeltran.com.ar', password: 'ProfeCeballos2025!', role: 'Profesor' }
  ];

  // Inyección de dependencias usando el API moderno de Angular
  private constructorForm = inject(FormBuilder);
  private servicioAuth = inject(AuthService); // Servicio para autenticación
  private enrutador = inject(Router); // Para navegación programática

  constructor() {
    // Inicialización del formulario reactivo con validaciones
    this.formularioLogin = this.constructorForm.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  /**
   * Muestra u oculta el panel de credenciales de demostración
   * @returns void
   */
  alternarCredenciales() {
    // Alternamos el valor del booleano usando negación
    this.mostrarCredenciales = !this.mostrarCredenciales;
  }

  /**
   * Método para procesar el inicio de sesión
   * Valida el formulario y envía las credenciales al servicio de autenticación
   */
  iniciarSesion() {
    // Si el formulario es inválido, salimos sin hacer nada
    if (this.formularioLogin.invalid) {
      return;
    }

    // Activamos el indicador de carga
    this.cargando = true;
    // Extraemos email y contraseña del formulario usando desestructuración
    const { email, password } = this.formularioLogin.value;

    // Llamamos al servicio de autenticación y nos suscribimos al observable
    this.servicioAuth.login(email, password).subscribe({
      next: (success) => {
        if (success) {
          Swal.fire({
            icon: 'success',
            title: '¡Inicio de sesión exitoso!',
            text: 'Bienvenido de nuevo.',
            timer: 1500,
            showConfirmButton: false
          });
          // Navegamos al dashboard tras el éxito de la autenticación
          this.enrutador.navigate(['/dashboard']);
        } else {
          // Mostramos alerta de error de credenciales
          Swal.fire({
            icon: 'error',
            title: 'Error de autenticación',
            text: 'El email o la contraseña son incorrectos.'
          });
        }
      },
      error: () => {
        // Manejo de errores de conexión o servidor
        Swal.fire({
          icon: 'error',
          title: 'Error del servidor',
          text: 'No se pudo conectar con el servidor. Intente más tarde.'
        });
      },
      complete: () => {
        // Desactivamos el indicador de carga al finalizar
        this.cargando = false;
      }
    });
  }

}
