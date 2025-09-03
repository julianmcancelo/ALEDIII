import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { UserService, CrearUsuarioRequest } from '../../../nucleo/servicios/user.service';
import Swal from 'sweetalert2';

export type TipoUsuario = 'student' | 'profesor' | 'admin';

@Component({
  selector: 'app-registro-usuario',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div class="max-w-md w-full mx-auto">
        <!-- Header -->
        <div class="text-center mb-8">
          <h1 class="text-3xl font-extrabold text-gray-900 mb-2">Registro de Usuario</h1>
          <p class="text-gray-600">Completa el formulario para crear un nuevo usuario</p>
        </div>

        <!-- Selector de tipo de usuario -->
        <div class="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 class="text-lg font-medium text-gray-900 mb-4">Tipo de Usuario</h2>
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <button
              type="button"
              (click)="cambiarTipoUsuario('student')"
              class="flex flex-col items-center justify-center p-4 rounded-lg border-2 transition-all"
              [class.border-blue-500]="tipoUsuario === 'student'"
              [class.bg-blue-50]="tipoUsuario === 'student'"
              [class.border-gray-200]="tipoUsuario !== 'student'"
            >
              <svg class="w-8 h-8 mb-2" [ngClass]="{'text-blue-600': tipoUsuario === 'student', 'text-gray-500': tipoUsuario !== 'student'}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 14l9-5-9-5-9 5 9 5z"></path>
              </svg>
              <span class="font-medium">Estudiante</span>
            </button>

            <button
              type="button"
              (click)="cambiarTipoUsuario('profesor')"
              class="flex flex-col items-center justify-center p-4 rounded-lg border-2 transition-all"
              [class.border-green-500]="tipoUsuario === 'profesor'"
              [class.bg-green-50]="tipoUsuario === 'profesor'"
              [class.border-gray-200]="tipoUsuario !== 'profesor'"
            >
              <svg class="w-8 h-8 mb-2" [ngClass]="{'text-green-600': tipoUsuario === 'profesor', 'text-gray-500': tipoUsuario !== 'profesor'}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
              </svg>
              <span class="font-medium">Profesor</span>
            </button>

            <button
              type="button"
              (click)="cambiarTipoUsuario('admin')"
              class="flex flex-col items-center justify-center p-4 rounded-lg border-2 transition-all"
              [class.border-red-500]="tipoUsuario === 'admin'"
              [class.bg-red-50]="tipoUsuario === 'admin'"
              [class.border-gray-200]="tipoUsuario !== 'admin'"
            >
              <svg class="w-8 h-8 mb-2" [ngClass]="{'text-red-600': tipoUsuario === 'admin', 'text-gray-500': tipoUsuario !== 'admin'}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
              </svg>
              <span class="font-medium">Administrador</span>
            </button>
          </div>
        </div>

        <!-- Información del rol seleccionado -->
        <div class="bg-white rounded-lg shadow-lg p-6 mb-6" [ngClass]="{
          'border-l-4 border-blue-500': tipoUsuario === 'student',
          'border-l-4 border-green-500': tipoUsuario === 'profesor',
          'border-l-4 border-red-500': tipoUsuario === 'admin'
        }">
          <div class="flex items-start">
            <div class="flex-shrink-0 mr-3">
              <svg class="w-6 h-6" [ngClass]="{
                'text-blue-500': tipoUsuario === 'student',
                'text-green-500': tipoUsuario === 'profesor',
                'text-red-500': tipoUsuario === 'admin'
              }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <div>
              <h3 class="font-medium text-gray-900">{{ getTitulo() }}</h3>
              <p class="text-sm text-gray-500 mt-1">{{ getDescripcionRol() }}</p>
            </div>
          </div>
        </div>

        <!-- Formulario -->
        <div class="bg-white rounded-lg shadow-lg overflow-hidden">
          <div class="px-6 py-4 border-b border-gray-200" [ngClass]="{
            'bg-blue-50': tipoUsuario === 'student',
            'bg-green-50': tipoUsuario === 'profesor',
            'bg-red-50': tipoUsuario === 'admin'
          }">
            <h2 class="text-lg font-semibold text-gray-800">Datos del Usuario</h2>
          </div>

          <div class="p-6">
            <form [formGroup]="formulario" (ngSubmit)="crearUsuario()">
              <!-- Campos del formulario -->
              <div class="space-y-6">
                <!-- Nombre -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">
                    {{ tipoUsuario === 'student' ? 'Nombre del Estudiante' : 
                       tipoUsuario === 'profesor' ? 'Nombre del Profesor' : 'Nombre del Administrador' }}
                  </label>
                  <input 
                    type="text" 
                    formControlName="name" 
                    [placeholder]="getPlaceholderNombre()"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:outline-none"
                    [class.focus:ring-blue-500]="tipoUsuario === 'student'"
                    [class.focus:ring-green-500]="tipoUsuario === 'profesor'"
                    [class.focus:ring-red-500]="tipoUsuario === 'admin'"
                    [class.border-red-500]="formulario.get('name')?.invalid && formulario.get('name')?.touched">
                  <div *ngIf="formulario.get('name')?.hasError('required') && formulario.get('name')?.touched" 
                       class="mt-1 text-sm text-red-600">
                    El nombre es requerido
                  </div>
                </div>

                <!-- Email -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input 
                    type="email" 
                    formControlName="email" 
                    [placeholder]="getPlaceholderEmail()"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:outline-none"
                    [class.focus:ring-blue-500]="tipoUsuario === 'student'"
                    [class.focus:ring-green-500]="tipoUsuario === 'profesor'"
                    [class.focus:ring-red-500]="tipoUsuario === 'admin'"
                    [class.border-red-500]="formulario.get('email')?.invalid && formulario.get('email')?.touched">
                  <div *ngIf="formulario.get('email')?.hasError('required') && formulario.get('email')?.touched" 
                       class="mt-1 text-sm text-red-600">
                    El email es requerido
                  </div>
                  <div *ngIf="formulario.get('email')?.hasError('email') && formulario.get('email')?.touched" 
                       class="mt-1 text-sm text-red-600">
                    Ingresa un email válido
                  </div>
                </div>

                <!-- Campos específicos por rol -->
                <div *ngIf="tipoUsuario === 'student'" class="space-y-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">DNI</label>
                    <input 
                      type="text" 
                      formControlName="dni" 
                      placeholder="12345678"
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      [class.border-red-500]="formulario.get('dni')?.invalid && formulario.get('dni')?.touched">
                    <div *ngIf="formulario.get('dni')?.hasError('required') && formulario.get('dni')?.touched" 
                         class="mt-1 text-sm text-red-600">
                      El DNI es requerido
                    </div>
                  </div>
                  
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Carrera</label>
                    <select 
                      formControlName="carrera"
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none">
                      <option value="">Seleccionar carrera</option>
                      <option value="Técnico en Informática">Técnico en Informática</option>
                      <option value="Técnico en Electrónica">Técnico en Electrónica</option>
                      <option value="Técnico en Mecánica">Técnico en Mecánica</option>
                      <option value="Técnico en Administración">Técnico en Administración</option>
                    </select>
                    <div *ngIf="formulario.get('carrera')?.hasError('required') && formulario.get('carrera')?.touched" 
                         class="mt-1 text-sm text-red-600">
                      La carrera es requerida
                    </div>
                  </div>
                </div>

                <div *ngIf="tipoUsuario === 'profesor'" class="space-y-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Especialidad</label>
                    <input 
                      type="text" 
                      formControlName="especialidad" 
                      placeholder="Matemáticas, Programación, etc."
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none">
                    <div *ngIf="formulario.get('especialidad')?.hasError('required') && formulario.get('especialidad')?.touched" 
                         class="mt-1 text-sm text-red-600">
                      La especialidad es requerida
                    </div>
                  </div>
                  
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
                    <input 
                      type="tel" 
                      formControlName="telefono" 
                      placeholder="+54 11 1234-5678"
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none">
                  </div>
                </div>

                <div *ngIf="tipoUsuario === 'admin'">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Departamento</label>
                    <select 
                      formControlName="departamento"
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:outline-none">
                      <option value="">Seleccionar departamento</option>
                      <option value="Dirección">Dirección</option>
                      <option value="Secretaría Académica">Secretaría Académica</option>
                      <option value="Administración">Administración</option>
                      <option value="Sistemas">Sistemas</option>
                    </select>
                    <div *ngIf="formulario.get('departamento')?.hasError('required') && formulario.get('departamento')?.touched" 
                         class="mt-1 text-sm text-red-600">
                      El departamento es requerido
                    </div>
                  </div>
                </div>

                <!-- Contraseña -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
                  <input 
                    type="password" 
                    formControlName="password" 
                    placeholder="Mínimo 6 caracteres"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:outline-none"
                    [class.focus:ring-blue-500]="tipoUsuario === 'student'"
                    [class.focus:ring-green-500]="tipoUsuario === 'profesor'"
                    [class.focus:ring-red-500]="tipoUsuario === 'admin'"
                    [class.border-red-500]="formulario.get('password')?.invalid && formulario.get('password')?.touched">
                  <div *ngIf="formulario.get('password')?.hasError('required') && formulario.get('password')?.touched" 
                       class="mt-1 text-sm text-red-600">
                    La contraseña es requerida
                  </div>
                  <div *ngIf="formulario.get('password')?.hasError('minlength') && formulario.get('password')?.touched" 
                       class="mt-1 text-sm text-red-600">
                    La contraseña debe tener al menos 6 caracteres
                  </div>
                </div>

                <!-- Confirmar contraseña -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Confirmar contraseña</label>
                  <input 
                    type="password" 
                    formControlName="confirmPassword" 
                    placeholder="Confirma tu contraseña"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:outline-none"
                    [class.focus:ring-blue-500]="tipoUsuario === 'student'"
                    [class.focus:ring-green-500]="tipoUsuario === 'profesor'"
                    [class.focus:ring-red-500]="tipoUsuario === 'admin'"
                    [class.border-red-500]="formulario.get('confirmPassword')?.invalid && formulario.get('confirmPassword')?.touched">
                  <div *ngIf="formulario.get('confirmPassword')?.hasError('required') && formulario.get('confirmPassword')?.touched" 
                       class="mt-1 text-sm text-red-600">
                    Debes confirmar la contraseña
                  </div>
                  <div *ngIf="formulario.hasError('passwordMismatch') && formulario.get('confirmPassword')?.touched" 
                       class="mt-1 text-sm text-red-600">
                    Las contraseñas no coinciden
                  </div>
                </div>

                <!-- Términos y condiciones -->
                <div class="flex items-start">
                  <div class="flex items-center h-5">
                    <input
                      type="checkbox"
                      formControlName="aceptaTerminos"
                      class="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500">
                  </div>
                  <div class="ml-3">
                    <label class="text-sm text-gray-600">
                      Acepto los términos y condiciones de uso
                    </label>
                    <div *ngIf="formulario.get('aceptaTerminos')?.hasError('required') && formulario.get('aceptaTerminos')?.touched" 
                         class="mt-1 text-sm text-red-600">
                      Debes aceptar los términos y condiciones
                    </div>
                  </div>
                </div>
              </div>

              <!-- Botones del formulario -->
              <div class="mt-8 space-y-3">
                <button 
                  type="submit"
                  [disabled]="formulario.invalid || cargando"
                  class="w-full py-3 px-4 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex justify-center"
                  [ngClass]="{
                    'bg-blue-500 hover:bg-blue-600': tipoUsuario === 'student',
                    'bg-green-500 hover:bg-green-600': tipoUsuario === 'profesor',
                    'bg-red-500 hover:bg-red-600': tipoUsuario === 'admin'
                  }">
                  <span *ngIf="!cargando">{{ getTextoBoton() }}</span>
                  <span *ngIf="cargando" class="flex items-center">
                    <svg class="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creando usuario...
                  </span>
                </button>
                
                <button 
                  type="button"
                  (click)="cancelar()"
                  class="w-full py-3 px-4 border border-gray-300 bg-white text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors">
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>

        <!-- Enlaces de ayuda -->
        <div class="mt-6 text-center">
          <p class="text-sm text-gray-600">
            ¿Necesitas ayuda? <a href="#" class="text-blue-600 hover:underline">Contacta con soporte</a>
          </p>
        </div>
      </div>
    </div>
  `
})
export class RegistroUsuarioComponent implements OnInit {
  tipoUsuario: TipoUsuario = 'student';
  formulario: FormGroup;
  cargando = false;

  private fb = inject(FormBuilder);
  private userService = inject(UserService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  constructor() {
    this.formulario = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]],
      dni: [''],
      carrera: [''],
      especialidad: [''],
      telefono: [''],
      departamento: [''],
      aceptaTerminos: [false, [Validators.requiredTrue]]
    }, { validators: this.passwordMatchValidator });
  }

  ngOnInit(): void {
    // Obtener tipo de usuario de la URL si existe
    this.route.queryParams.subscribe(params => {
      if (params['tipo'] && ['student', 'profesor', 'admin'].includes(params['tipo'])) {
        this.tipoUsuario = params['tipo'] as TipoUsuario;
        this.configurarValidaciones();
      }
    });
  }

  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    
    if (password !== confirmPassword) {
      form.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }
    
    return null;
  }

  cambiarTipoUsuario(tipo: TipoUsuario): void {
    this.tipoUsuario = tipo;
    this.configurarValidaciones();
    this.formulario.reset({
      aceptaTerminos: false
    });
  }

  configurarValidaciones(): void {
    const dniControl = this.formulario.get('dni');
    const carreraControl = this.formulario.get('carrera');
    const especialidadControl = this.formulario.get('especialidad');
    const departamentoControl = this.formulario.get('departamento');

    // Limpiar validaciones previas
    dniControl?.clearValidators();
    carreraControl?.clearValidators();
    especialidadControl?.clearValidators();
    departamentoControl?.clearValidators();

    // Aplicar validaciones según el tipo de usuario
    if (this.tipoUsuario === 'student') {
      dniControl?.setValidators([Validators.required]);
      carreraControl?.setValidators([Validators.required]);
    } else if (this.tipoUsuario === 'profesor') {
      especialidadControl?.setValidators([Validators.required]);
    } else if (this.tipoUsuario === 'admin') {
      departamentoControl?.setValidators([Validators.required]);
    }

    // Actualizar validaciones
    dniControl?.updateValueAndValidity();
    carreraControl?.updateValueAndValidity();
    especialidadControl?.updateValueAndValidity();
    departamentoControl?.updateValueAndValidity();
  }

  getTitulo(): string {
    const titulos = {
      'student': 'Registro de Estudiante',
      'profesor': 'Registro de Profesor',
      'admin': 'Registro de Administrador'
    };
    return titulos[this.tipoUsuario];
  }

  getDescripcionRol(): string {
    const descripciones = {
      'student': 'Los estudiantes pueden acceder a sus calificaciones, horarios y material de estudio.',
      'profesor': 'Los profesores pueden gestionar sus clases, calificar estudiantes y acceder a herramientas académicas.',
      'admin': 'Los administradores tienen acceso completo al sistema y pueden gestionar usuarios y configuraciones.'
    };
    return descripciones[this.tipoUsuario];
  }

  getPlaceholderNombre(): string {
    const placeholders = {
      'student': 'Juan Pérez',
      'profesor': 'Prof. María González',
      'admin': 'Admin. Carlos López'
    };
    return placeholders[this.tipoUsuario];
  }

  getPlaceholderEmail(): string {
    const placeholders = {
      'student': 'juan.perez@estudiante.ibeltran.com.ar',
      'profesor': 'maria.gonzalez@profesor.ibeltran.com.ar',
      'admin': 'carlos.lopez@admin.ibeltran.com.ar'
    };
    return placeholders[this.tipoUsuario];
  }

  getTextoBoton(): string {
    const textos = {
      'student': 'Registrar Estudiante',
      'profesor': 'Registrar Profesor',
      'admin': 'Registrar Administrador'
    };
    return textos[this.tipoUsuario];
  }

  crearUsuario(): void {
    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      return;
    }

    this.cargando = true;
    const datosUsuario: CrearUsuarioRequest = {
      name: this.formulario.get('name')?.value,
      email: this.formulario.get('email')?.value,
      password: this.formulario.get('password')?.value,
      role: this.tipoUsuario
    };

    // Datos adicionales específicos que podrían enviarse a un endpoint diferente o procesarse de otra manera
    const datosAdicionales: any = {};

    if (this.tipoUsuario === 'student') {
      datosAdicionales.dni = this.formulario.get('dni')?.value;
      datosAdicionales.carrera = this.formulario.get('carrera')?.value;
    } else if (this.tipoUsuario === 'profesor') {
      datosAdicionales.especialidad = this.formulario.get('especialidad')?.value;
      datosAdicionales.telefono = this.formulario.get('telefono')?.value;
    } else if (this.tipoUsuario === 'admin') {
      datosAdicionales.departamento = this.formulario.get('departamento')?.value;
    }

    this.userService.crearUsuario(datosUsuario).subscribe({
      next: (usuario) => {
        // Aquí se podrían guardar los datos adicionales en otra tabla
        console.log('Datos adicionales a guardar:', datosAdicionales);
        
        Swal.fire({
          icon: 'success',
          title: '¡Usuario registrado!',
          text: `El ${this.getTitulo().toLowerCase()} ha sido registrado correctamente`,
          confirmButtonText: 'Continuar',
          confirmButtonColor: this.tipoUsuario === 'student' ? '#3B82F6' : 
                             this.tipoUsuario === 'profesor' ? '#10B981' : '#EF4444'
        }).then(() => {
          this.router.navigate(['/administracion/usuarios']);
        });
        this.cargando = false;
      },
      error: (error) => {
        console.error('Error al crear usuario:', error);
        let mensaje = error.error?.error || `No se pudo crear el ${this.tipoUsuario}`;
        
        // Manejo de errores específicos
        if (error.status === 409) {
          mensaje = 'El email ya está registrado. Intenta con otro.';
        }
        
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: mensaje,
          confirmButtonText: 'Entendido'
        });
        this.cargando = false;
      }
    });
  }

  cancelar(): void {
    this.router.navigate(['/administracion/usuarios']);
  }
}
