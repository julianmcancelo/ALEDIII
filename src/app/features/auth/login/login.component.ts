import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="min-h-screen bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div class="sm:mx-auto sm:w-full sm:max-w-md">
        <img class="mx-auto h-12 w-auto" src="/assets/logo.png" alt="Instituto Beltrán">
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Instituto Tecnológico Beltrán
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600">
          Bienvenido al portal de gestión académica
        </p>
      </div>

      <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div class="bg-white py-8 px-4 shadow-xl rounded-lg sm:px-10">
          <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="space-y-6">
            <div>
              <label for="email" class="block text-sm font-medium text-gray-700"> Email </label>
              <div class="mt-1">
                <input id="email" formControlName="email" type="email" required class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
              </div>
            </div>

            <div>
              <label for="password" class="block text-sm font-medium text-gray-700"> Contraseña </label>
              <div class="mt-1">
                <input id="password" formControlName="password" [type]="hidePassword ? 'password' : 'text'" required class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
              </div>
            </div>

            <div class="flex items-center justify-between">
              <div class="text-sm">
                <a href="#" class="font-medium text-indigo-600 hover:text-indigo-500"> ¿Olvidaste tu contraseña? </a>
              </div>
            </div>

            <div>
              <button type="submit" [disabled]="loginForm.invalid || isLoading" class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed">
                <span *ngIf="!isLoading">Iniciar Sesión</span>
                <span *ngIf="isLoading">Ingresando...</span>
              </button>
            </div>
          </form>

          <div class="mt-6">
            <div class="relative">
              <div class="absolute inset-0 flex items-center">
                <div class="w-full border-t border-gray-300"></div>
              </div>
              <div class="relative flex justify-center text-sm">
                <span class="px-2 bg-white text-gray-500"> O ingresa con un usuario de prueba </span>
              </div>
            </div>

            <div class="mt-6 grid grid-cols-1 gap-3">
              <button type="button" (click)="loginAs('admin')" class="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
                <span>👨‍💼 Admin</span>
              </button>
              <button type="button" (click)="loginAs('student')" class="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
                <span>🎓 Estudiante</span>
              </button>
              <button type="button" (click)="loginAs('profesor')" class="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
                <span>👨‍🏫 Profesor</span>
              </button>
            </div>

            <div class="mt-4">
              <button type="button" (click)="toggleDemoCredentials()" class="w-full text-sm text-indigo-600 hover:text-indigo-500 font-medium py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                {{ showDemoCredentials ? 'Ocultar' : 'Mostrar' }} Credenciales de Demo
              </button>
            </div>

            <div *ngIf="showDemoCredentials" class="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <h4 class="text-sm font-medium text-gray-800 mb-2">Usuarios de Prueba</h4>
              <ul class="space-y-2 text-xs text-gray-600">
                <li *ngFor="let user of demoUsers">
                  <p><strong>Rol:</strong> {{ user.role }}</p>
                  <p><strong>Email:</strong> {{ user.email }}</p>
                  <p><strong>Clave:</strong> {{ user.password }}</p>
                </li>
              </ul>
            </div>

          </div>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class LoginComponent {
  loginForm: FormGroup;
  hidePassword = true;
  isLoading = false;
  showDemoCredentials = false;

  demoUsers = [
    { email: 'admin@ibeltran.com.ar', password: 'AdminPassword2025!', role: 'Administrador' },
    { email: 'sebastian.saldivar@ibeltran.com.ar', password: 'ProfeSaldivar2025!', role: 'Profesor' },
    { email: 'jose.casalnovo@ibeltran.com.ar', password: 'ProfeCasalnovo2025!', role: 'Profesor' },
    { email: 'gabriela.tajes@ibeltran.com.ar', password: 'ProfeTajes2025!', role: 'Profesor' },
    { email: 'sebastian.ceballos@ibeltran.com.ar', password: 'ProfeCeballos2025!', role: 'Profesor' }
  ];

  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  constructor() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  toggleDemoCredentials() {
    this.showDemoCredentials = !this.showDemoCredentials;
  }

  onSubmit() {
    if (this.loginForm.invalid) {
      return;
    }

    this.isLoading = true;
    const { email, password } = this.loginForm.value;

    this.authService.login(email, password).subscribe({
      next: (success) => {
        if (success) {
          Swal.fire({
            icon: 'success',
            title: '¡Inicio de sesión exitoso!',
            text: 'Bienvenido de nuevo.',
            timer: 1500,
            showConfirmButton: false
          });
          this.router.navigate(['/dashboard']);
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Error de autenticación',
            text: 'El email o la contraseña son incorrectos.'
          });
        }
      },
      error: () => {
        Swal.fire({
          icon: 'error',
          title: 'Error del servidor',
          text: 'No se pudo conectar con el servidor. Intente más tarde.'
        });
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  loginAs(role: 'admin' | 'student' | 'profesor') {
    const credentials = {
      admin: { email: 'admin@ibeltran.com.ar', password: 'AdminPassword2025!' },
      // Usamos el primer profesor como ejemplo para el botón
      profesor: { email: 'sebastian.saldivar@ibeltran.com.ar', password: 'ProfeSaldivar2025!' },
      // El rol estudiante no tiene un usuario de prueba en el recurso 'users', lo quitamos por ahora
      student: { email: 'alumno@ibeltran.com.ar', password: 'password' } // Este usuario no existe en la API de users
    };

    if (role !== 'student') {
      this.loginForm.patchValue(credentials[role]);
      this.onSubmit();
    } else {
      Swal.fire('Info', 'La funcionalidad de login para estudiantes no está implementada en este demo.', 'info');
    }
  }
}
