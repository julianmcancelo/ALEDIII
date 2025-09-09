/**
 * @file setup.component.ts
 * @description Componente para la configuración inicial del sistema
 * Permite crear el primer usuario administrador cuando el sistema está vacío
 * 
 * TP Final Algoritmos y Estructuras de Datos III - 2025
 * Alumnos: CANCELO JULIAN - NICOLAS OTERO (Curso 3ra 1RA)
 * Profesor: Sebastian Saldivar
 */
import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../servicios/auth.service';
import Swal from 'sweetalert2';

/**
 * @class SetupComponent
 * @description Componente para la configuración inicial del sistema
 * Se muestra automáticamente cuando no hay usuarios en el sistema
 */
@Component({
  selector: 'app-setup',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="min-h-screen bg-gradient-to-b from-blue-900 via-blue-700 to-indigo-800 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div class="sm:mx-auto sm:w-full sm:max-w-md">
        <div class="bg-white p-3 rounded-full inline-block mx-auto shadow-lg">
          <img class="h-16 w-auto" src="/assets/logo.png" alt="Instituto Beltrán">
        </div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-white">
          Configuración Inicial
        </h2>
        <p class="mt-2 text-center text-base text-blue-100">
          Bienvenido al sistema de gestión académica del Instituto Beltrán
        </p>
        <p class="mt-2 text-center text-sm text-blue-200">
          Por favor, cree un usuario administrador para comenzar
        </p>
      </div>

      <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div class="bg-white py-8 px-6 shadow-2xl rounded-xl sm:px-10 border-t-4 border-blue-500">
          <form [formGroup]="setupForm" (ngSubmit)="crearAdministrador()" class="space-y-6">
            <!-- Nombre -->
            <div>
              <label for="name" class="block text-sm font-medium text-gray-700">Nombre completo</label>
              <div class="mt-1 relative rounded-md shadow-sm">
                <input 
                  id="name" 
                  formControlName="name" 
                  type="text" 
                  placeholder="Nombre del Administrador"
                  required 
                  class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
              </div>
              <p *ngIf="setupForm.get('name')?.invalid && setupForm.get('name')?.touched" 
                 class="mt-1 text-xs text-red-600">El nombre es requerido</p>
            </div>

            <!-- Email -->
            <div>
              <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
              <div class="mt-1 relative rounded-md shadow-sm">
                <input 
                  id="email" 
                  formControlName="email" 
                  type="email" 
                  placeholder="admin@example.com"
                  required 
                  class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
              </div>
              <p *ngIf="setupForm.get('email')?.hasError('required') && setupForm.get('email')?.touched" 
                 class="mt-1 text-xs text-red-600">El email es requerido</p>
              <p *ngIf="setupForm.get('email')?.hasError('email') && setupForm.get('email')?.touched" 
                 class="mt-1 text-xs text-red-600">Por favor, ingresa un email válido</p>
            </div>

            <!-- Contraseña -->
            <div>
              <label for="password" class="block text-sm font-medium text-gray-700">Contraseña</label>
              <div class="mt-1 relative rounded-md shadow-sm">
                <input 
                  id="password" 
                  formControlName="password" 
                  [type]="ocultarContrasena ? 'password' : 'text'"
                  placeholder="Mínimo 8 caracteres"
                  required 
                  class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
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
              <p *ngIf="setupForm.get('password')?.hasError('required') && setupForm.get('password')?.touched" 
                 class="mt-1 text-xs text-red-600">La contraseña es requerida</p>
              <p *ngIf="setupForm.get('password')?.hasError('minlength') && setupForm.get('password')?.touched" 
                 class="mt-1 text-xs text-red-600">La contraseña debe tener al menos 8 caracteres</p>
            </div>

            <!-- Confirmar contraseña -->
            <div>
              <label for="confirmPassword" class="block text-sm font-medium text-gray-700">Confirmar contraseña</label>
              <div class="mt-1 relative rounded-md shadow-sm">
                <input 
                  id="confirmPassword" 
                  formControlName="confirmPassword" 
                  [type]="ocultarContrasena ? 'password' : 'text'"
                  placeholder="Repite tu contraseña"
                  required 
                  class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
              </div>
              <p *ngIf="setupForm.get('confirmPassword')?.hasError('required') && setupForm.get('confirmPassword')?.touched" 
                 class="mt-1 text-xs text-red-600">Debes confirmar tu contraseña</p>
              <p *ngIf="setupForm.hasError('passwordMismatch') && setupForm.get('confirmPassword')?.touched && !setupForm.get('confirmPassword')?.hasError('required')" 
                 class="mt-1 text-xs text-red-600">Las contraseñas no coinciden</p>
            </div>

            <!-- Botón de envío -->
            <div class="mt-8">
              <button 
                type="submit" 
                [disabled]="setupForm.invalid || cargando"
                class="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200">
                <span *ngIf="!cargando">Crear Administrador</span>
                <span *ngIf="cargando" class="flex items-center">
                  <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creando...
                </span>
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- Footer con información -->
      <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md text-center">
        <p class="text-sm text-blue-100">
          Este usuario tendrá acceso completo al sistema de gestión académica.
        </p>
        <p class="text-xs text-blue-200 mt-2">
          Instituto Tecnológico Beltrán - Sistema de Gestión Académica v1.0
        </p>
      </div>
    </div>
  `,
  styles: []
})
export class SetupComponent implements OnInit {
  /**
   * @property setupForm
   * @description Formulario reactivo para validación de campos
   */
  setupForm: FormGroup;
  
  /**
   * @property ocultarContrasena
   * @description Toggle para mostrar/ocultar contraseña
   */
  ocultarContrasena = true;
  
  /**
   * @property cargando
   * @description Estado de carga durante la creación del administrador
   */
  cargando = false;

  // Inyección de dependencias
  private formBuilder = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  constructor() {
    // Inicializar formulario con validaciones
    this.setupForm = this.formBuilder.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required]
    }, { validators: this.passwordMatchValidator });
  }

  ngOnInit(): void {
    // Verificar si ya existen usuarios
    this.authService.checkIfUsersExist().subscribe(hasUsers => {
      if (hasUsers) {
        // Si ya hay usuarios, redirigir al login
        this.router.navigate(['/auth/login']);
      }
    });
  }

  /**
   * @method passwordMatchValidator
   * @description Validador personalizado para verificar que las contraseñas coincidan
   */
  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    
    if (password !== confirmPassword) {
      form.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }
    
    return null;
  }

  /**
   * @method crearAdministrador
   * @description Crea el usuario administrador inicial
   */
  crearAdministrador(): void {
    if (this.setupForm.invalid) {
      // Marcar todos los campos como tocados para mostrar errores
      this.setupForm.markAllAsTouched();
      return;
    }

    this.cargando = true;
    const { name, email, password } = this.setupForm.value;

    this.authService.createInitialAdmin(name, email, password).subscribe({
      next: (user) => {
        Swal.fire({
          icon: 'success',
          title: 'Configuración exitosa',
          text: '¡El usuario administrador ha sido creado! Ya puedes usar el sistema.',
          confirmButtonText: 'Continuar'
        }).then(() => {
          // Redirigir al dashboard
          this.router.navigate(['/dashboard']);
        });
      },
      error: (err) => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudo crear el usuario administrador. Por favor, inténtalo de nuevo.',
        });
        this.cargando = false;
      }
    });
  }

  /**
   * @note Componente implementado como parte del TP Final
   * Algoritmos y Estructuras de Datos III - 2025
   * Alumnos: CANCELO JULIAN - NICOLAS OTERO (Curso 3ra 1RA)
   */
}
