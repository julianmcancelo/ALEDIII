import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';
import Swal from 'sweetalert2';

@Component({
    selector: 'app-login',
    imports: [CommonModule, ReactiveFormsModule],
    template: `
    <div class="min-h-screen bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <!-- Botón flotante para credenciales de demo -->
      <div class="fixed top-4 right-4 z-10">
        <button type="button" (click)="toggleDemoCredentials()" class="bg-indigo-600 text-white rounded-full p-3 shadow-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H5v-2H3v-2H1v-4a6 6 0 016-6h4a6 6 0 016 6z" />
          </svg>
        </button>

        <!-- Panel de credenciales -->
        <div *ngIf="showDemoCredentials" class="absolute top-14 right-0 w-72 p-4 bg-white rounded-lg shadow-xl border border-gray-200">
          <h4 class="text-sm font-medium text-gray-800 mb-2">Usuarios de Prueba</h4>
          <ul class="space-y-2 text-xs text-gray-600">
            <li *ngFor="let user of demoUsers" class="border-b pb-1 last:border-b-0">
              <p><strong>Rol:</strong> <span class="font-mono">{{ user.role }}</span></p>
              <p><strong>Email:</strong> <span class="font-mono">{{ user.email }}</span></p>
              <p><strong>Clave:</strong> <span class="font-mono">{{ user.password }}</span></p>
            </li>
          </ul>
        </div>
      </div>

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

}
