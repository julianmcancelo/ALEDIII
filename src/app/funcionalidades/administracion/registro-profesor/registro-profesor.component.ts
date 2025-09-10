import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService, CrearUsuarioRequest } from '../../../nucleo/servicios/user.service';

@Component({
  selector: 'app-registro-profesor',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="min-h-screen bg-gray-50 p-4">
      <div class="max-w-4xl mx-auto">
        
        <!-- HEADER -->
        <div class="mb-8">
          <div class="flex items-center justify-between">
            <div>
              <h1 class="text-2xl font-bold text-gray-900">Registro de Profesor</h1>
              <p class="text-gray-600 mt-1">Crear nuevo usuario con rol de profesor</p>
            </div>
            <button 
              (click)="volver()"
              class="flex items-center px-4 py-2 text-gray-600 hover:text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50">
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
              </svg>
              Volver
            </button>
          </div>
        </div>

        <!-- FORMULARIO -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200">
          <div class="px-6 py-4 border-b border-gray-200">
            <h2 class="text-lg font-semibold text-gray-900">Información del Profesor</h2>
            <p class="text-sm text-gray-600 mt-1">Complete todos los campos requeridos</p>
          </div>

          <form [formGroup]="profesorForm" (ngSubmit)="onSubmit()" class="p-6">
            
            <!-- INFORMACIÓN BÁSICA -->
            <div class="mb-8">
              <h3 class="text-md font-medium text-gray-900 mb-4">Información Personal</h3>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                <!-- Nombre -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Nombre Completo *
                  </label>
                  <input
                    type="text"
                    formControlName="name"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    [class.border-red-500]="profesorForm.get('name')?.invalid && profesorForm.get('name')?.touched"
                    placeholder="Ingrese el nombre completo">
                  <div *ngIf="profesorForm.get('name')?.invalid && profesorForm.get('name')?.touched" 
                       class="text-red-500 text-sm mt-1">
                    El nombre es requerido
                  </div>
                </div>

                <!-- Email -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    formControlName="email"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    [class.border-red-500]="profesorForm.get('email')?.invalid && profesorForm.get('email')?.touched"
                    placeholder="profesor@instituto.edu">
                  <div *ngIf="profesorForm.get('email')?.invalid && profesorForm.get('email')?.touched" 
                       class="text-red-500 text-sm mt-1">
                    <span *ngIf="profesorForm.get('email')?.errors?.['required']">El email es requerido</span>
                    <span *ngIf="profesorForm.get('email')?.errors?.['email']">Formato de email inválido</span>
                  </div>
                </div>

                <!-- DNI -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    DNI *
                  </label>
                  <input
                    type="text"
                    formControlName="dni"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    [class.border-red-500]="profesorForm.get('dni')?.invalid && profesorForm.get('dni')?.touched"
                    placeholder="12345678">
                  <div *ngIf="profesorForm.get('dni')?.invalid && profesorForm.get('dni')?.touched" 
                       class="text-red-500 text-sm mt-1">
                    El DNI es requerido
                  </div>
                </div>

                <!-- Teléfono -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Teléfono
                  </label>
                  <input
                    type="tel"
                    formControlName="telefono"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="+54 9 11 1234-5678">
                </div>

              </div>
            </div>

            <!-- INFORMACIÓN ACADÉMICA -->
            <div class="mb-8">
              <h3 class="text-md font-medium text-gray-900 mb-4">Información Académica</h3>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                <!-- Legajo -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Legajo *
                  </label>
                  <input
                    type="text"
                    formControlName="legajo"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    [class.border-red-500]="profesorForm.get('legajo')?.invalid && profesorForm.get('legajo')?.touched"
                    placeholder="PROF-2024-001">
                  <div *ngIf="profesorForm.get('legajo')?.invalid && profesorForm.get('legajo')?.touched" 
                       class="text-red-500 text-sm mt-1">
                    El legajo es requerido
                  </div>
                </div>

                <!-- Especialidad -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Especialidad *
                  </label>
                  <select
                    formControlName="especialidad"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    [class.border-red-500]="profesorForm.get('especialidad')?.invalid && profesorForm.get('especialidad')?.touched">
                    <option value="">Seleccione una especialidad</option>
                    <option value="Matemáticas">Matemáticas</option>
                    <option value="Física">Física</option>
                    <option value="Química">Química</option>
                    <option value="Programación">Programación</option>
                    <option value="Sistemas">Sistemas</option>
                    <option value="Electrónica">Electrónica</option>
                    <option value="Mecánica">Mecánica</option>
                    <option value="Inglés">Inglés</option>
                    <option value="Historia">Historia</option>
                    <option value="Filosofía">Filosofía</option>
                    <option value="Economía">Economía</option>
                    <option value="Administración">Administración</option>
                  </select>
                  <div *ngIf="profesorForm.get('especialidad')?.invalid && profesorForm.get('especialidad')?.touched" 
                       class="text-red-500 text-sm mt-1">
                    La especialidad es requerida
                  </div>
                </div>

                <!-- Departamento -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Departamento
                  </label>
                  <select
                    formControlName="departamento"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                    <option value="">Seleccione un departamento</option>
                    <option value="Dirección">Dirección</option>
                    <option value="Secretaría">Secretaría</option>
                    <option value="Administración">Administración</option>
                    <option value="Sistemas">Sistemas</option>
                  </select>
                </div>

              </div>
            </div>

            <!-- CREDENCIALES -->
            <div class="mb-8">
              <h3 class="text-md font-medium text-gray-900 mb-4">Credenciales de Acceso</h3>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                <!-- Contraseña -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Contraseña *
                  </label>
                  <input
                    type="password"
                    formControlName="password"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    [class.border-red-500]="profesorForm.get('password')?.invalid && profesorForm.get('password')?.touched"
                    placeholder="Mínimo 6 caracteres">
                  <div *ngIf="profesorForm.get('password')?.invalid && profesorForm.get('password')?.touched" 
                       class="text-red-500 text-sm mt-1">
                    <span *ngIf="profesorForm.get('password')?.errors?.['required']">La contraseña es requerida</span>
                    <span *ngIf="profesorForm.get('password')?.errors?.['minlength']">Mínimo 6 caracteres</span>
                  </div>
                </div>

                <!-- Confirmar Contraseña -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Confirmar Contraseña *
                  </label>
                  <input
                    type="password"
                    formControlName="confirmPassword"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    [class.border-red-500]="profesorForm.get('confirmPassword')?.invalid && profesorForm.get('confirmPassword')?.touched"
                    placeholder="Repita la contraseña">
                  <div *ngIf="profesorForm.get('confirmPassword')?.invalid && profesorForm.get('confirmPassword')?.touched" 
                       class="text-red-500 text-sm mt-1">
                    <span *ngIf="profesorForm.get('confirmPassword')?.errors?.['required']">Confirme la contraseña</span>
                  </div>
                  <div *ngIf="profesorForm.errors?.['passwordMismatch'] && profesorForm.get('confirmPassword')?.touched" 
                       class="text-red-500 text-sm mt-1">
                    Las contraseñas no coinciden
                  </div>
                </div>

              </div>
            </div>

            <!-- ESTADO DE CARGA -->
            <div *ngIf="loading" class="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div class="flex items-center">
                <div class="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600 mr-3"></div>
                <span class="text-blue-700">Registrando profesor...</span>
              </div>
            </div>

            <!-- ERROR -->
            <div *ngIf="error" class="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div class="flex items-center">
                <svg class="w-5 h-5 text-red-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <span class="text-red-700">{{ error }}</span>
              </div>
            </div>

            <!-- BOTONES -->
            <div class="flex justify-end space-x-4 pt-6 border-t border-gray-200">
              <button
                type="button"
                (click)="volver()"
                class="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
                Cancelar
              </button>
              <button
                type="submit"
                [disabled]="profesorForm.invalid || loading"
                class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed">
                <span *ngIf="loading" class="inline-flex items-center">
                  <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Registrando...
                </span>
                <span *ngIf="!loading">Registrar Profesor</span>
              </button>
            </div>

          </form>
        </div>

      </div>
    </div>
  `
})
export class RegistroProfesorComponent implements OnInit {
  profesorForm: FormGroup;
  loading = false;
  error = '';

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router
  ) {
    this.profesorForm = this.createForm();
  }

  ngOnInit(): void {
    // Componente inicializado
  }

  private createForm(): FormGroup {
    const form = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      dni: ['', [Validators.required]],
      telefono: [''],
      legajo: ['', [Validators.required]],
      especialidad: ['', [Validators.required]],
      departamento: [''],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator });

    return form;
  }

  private passwordMatchValidator(form: FormGroup) {
    const password = form.get('password');
    const confirmPassword = form.get('confirmPassword');
    
    if (password && confirmPassword && password.value !== confirmPassword.value) {
      return { passwordMismatch: true };
    }
    return null;
  }

  onSubmit(): void {
    if (this.profesorForm.valid) {
      this.loading = true;
      this.error = '';

      const formData = this.profesorForm.value;
      
      const profesorData: CrearUsuarioRequest = {
        name: formData.name,
        email: formData.email,
        role: 'profesor',
        password: formData.password,
        dni: formData.dni,
        telefono: formData.telefono,
        legajo: formData.legajo,
        especialidad: formData.especialidad,
        departamento: formData.departamento
      };

      this.userService.crearUsuario(profesorData).subscribe({
        next: (response) => {
          this.loading = false;
          // Redirigir a la gestión de profesores con mensaje de éxito
          this.router.navigate(['/dashboard/administracion/profesores'], {
            queryParams: { mensaje: 'Profesor registrado exitosamente' }
          });
        },
        error: (error) => {
          this.loading = false;
          console.error('Error al registrar profesor:', error);
          
          if (error.error?.message) {
            this.error = error.error.message;
          } else if (error.status === 409) {
            this.error = 'Ya existe un usuario con ese email o legajo';
          } else {
            this.error = 'Error al registrar el profesor. Intente nuevamente.';
          }
        }
      });
    } else {
      // Marcar todos los campos como tocados para mostrar errores
      Object.keys(this.profesorForm.controls).forEach(key => {
        this.profesorForm.get(key)?.markAsTouched();
      });
    }
  }

  volver(): void {
    this.router.navigate(['/dashboard/administracion/profesores']);
  }
}
