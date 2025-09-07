import { Component, Input, Output, EventEmitter, OnInit, OnChanges, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UserService } from '../../../nucleo/servicios/user.service';
import { CreateUserRequest, UserRole } from '../../../nucleo/modelos/user.model';
import Swal from 'sweetalert2';

// Ahora usamos UserRole del modelo user.model.ts

@Component({
  selector: 'app-modal-crear-usuario',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div *ngIf="mostrar" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" 
         (click)="cerrar()" 
         style="z-index: 9999;">
      <div class="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto" (click)="$event.stopPropagation()">
        <!-- Header -->
        <div class="px-6 py-4 border-b border-gray-200 flex justify-between items-center"
             [ngClass]="{
               'bg-blue-50': tipoUsuario === 'student',
               'bg-green-50': tipoUsuario === 'profesor', 
               'bg-red-50': tipoUsuario === 'admin'
             }">
          <h3 class="text-lg font-semibold text-gray-800">
            <span class="flex items-center">
              <svg class="w-5 h-5 mr-2" [ngClass]="{
                'text-blue-600': tipoUsuario === 'student',
                'text-green-600': tipoUsuario === 'profesor',
                'text-red-600': tipoUsuario === 'admin'
              }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path *ngIf="tipoUsuario === 'student'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 14l9-5-9-5-9 5 9 5z"></path>
                <path *ngIf="tipoUsuario === 'profesor'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                <path *ngIf="tipoUsuario === 'admin'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
              </svg>
              {{ getTituloModal() }}
            </span>
          </h3>
          <button (click)="cerrar()" class="text-gray-400 hover:text-gray-600">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>

        <!-- Body -->
        <div class="p-6">
          <form [formGroup]="formulario" (ngSubmit)="crearUsuario()">
            <!-- Información del tipo de usuario -->
            <div class="mb-6 p-4 rounded-lg" [ngClass]="{
              'bg-blue-50 border border-blue-200': tipoUsuario === 'student',
              'bg-green-50 border border-green-200': tipoUsuario === 'profesor',
              'bg-red-50 border border-red-200': tipoUsuario === 'admin'
            }">
              <p class="text-sm" [ngClass]="{
                'text-blue-700': tipoUsuario === 'student',
                'text-green-700': tipoUsuario === 'profesor',
                'text-red-700': tipoUsuario === 'admin'
              }">
                {{ getDescripcionRol() }}
              </p>
            </div>

            <!-- Campos del formulario -->
            <div class="space-y-4">
              <!-- Nombre -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  {{ tipoUsuario === 'student' ? 'Nombre del Estudiante' : 
                     tipoUsuario === 'profesor' ? 'Nombre del Profesor' : 'Nombre del Administrador' }}
                </label>
                <input 
                  type="text" 
                  formControlName="name" 
                  [placeholder]="getPlaceholderNombre()"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent"
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
                <label class="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input 
                  type="email" 
                  formControlName="email" 
                  [placeholder]="getPlaceholderEmail()"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent"
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
                  <label class="block text-sm font-medium text-gray-700 mb-2">DNI</label>
                  <input 
                    type="text" 
                    formControlName="dni" 
                    placeholder="12345678"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    [class.border-red-500]="formulario.get('dni')?.invalid && formulario.get('dni')?.touched">
                </div>
                
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Carrera</label>
                  <select 
                    formControlName="carrera"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    <option value="">Seleccionar carrera</option>
                    <option value="Técnico en Informática">Técnico en Informática</option>
                    <option value="Técnico en Electrónica">Técnico en Electrónica</option>
                    <option value="Técnico en Mecánica">Técnico en Mecánica</option>
                    <option value="Técnico en Administración">Técnico en Administración</option>
                  </select>
                </div>
              </div>

              <div *ngIf="tipoUsuario === 'profesor'" class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Especialidad</label>
                  <input 
                    type="text" 
                    formControlName="especialidad" 
                    placeholder="Matemáticas, Programación, etc."
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent">
                </div>
                
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Teléfono</label>
                  <input 
                    type="tel" 
                    formControlName="telefono" 
                    placeholder="+54 11 1234-5678"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent">
                </div>
              </div>

              <div *ngIf="tipoUsuario === 'admin'">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Departamento</label>
                  <select 
                    formControlName="departamento"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent">
                    <option value="">Seleccionar departamento</option>
                    <option value="Dirección">Dirección</option>
                    <option value="Secretaría Académica">Secretaría Académica</option>
                    <option value="Administración">Administración</option>
                    <option value="Sistemas">Sistemas</option>
                  </select>
                </div>
              </div>

              <!-- Contraseña -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Contraseña</label>
                <input 
                  type="password" 
                  formControlName="password" 
                  placeholder="Mínimo 6 caracteres"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent"
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
            </div>
          </form>
        </div>

        <!-- Footer -->
        <div class="px-6 py-4 border-t border-gray-200 flex justify-end space-x-3">
          <button 
            type="button"
            (click)="cerrar()"
            class="px-4 py-2 text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors">
            Cancelar
          </button>
          <button 
            type="button"
            (click)="crearUsuario()"
            [disabled]="formulario.invalid || cargando"
            class="px-4 py-2 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            [ngClass]="{
              'bg-blue-500 hover:bg-blue-600': tipoUsuario === 'student',
              'bg-green-500 hover:bg-green-600': tipoUsuario === 'profesor',
              'bg-red-500 hover:bg-red-600': tipoUsuario === 'admin'
            }">
            <span *ngIf="!cargando">{{ getTextoBoton() }}</span>
            <span *ngIf="cargando" class="flex items-center">
              <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Creando...
            </span>
          </button>
        </div>
      </div>
    </div>
  `
})
export class ModalCrearUsuarioComponent implements OnInit, OnChanges {
  @Input() mostrar = false;
  @Input() tipoUsuario: UserRole = 'student';
  @Output() cerrarModal = new EventEmitter<void>();
  @Output() usuarioCreado = new EventEmitter<any>();

  formulario: FormGroup;
  cargando = false;

  private fb = inject(FormBuilder);
  private userService = inject(UserService);

  constructor() {
    this.formulario = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      dni: [''],
      carrera: [''],
      especialidad: [''],
      telefono: [''],
      departamento: ['']
    });
  }

  ngOnInit(): void {
    // Configurar validaciones específicas por rol
    this.configurarValidaciones();
  }

  ngOnChanges(): void {
    if (this.mostrar) {
      this.configurarValidaciones();
      this.formulario.reset();
    }
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

  getTituloModal(): string {
    const titulos = {
      'student': 'Crear Nuevo Estudiante',
      'profesor': 'Crear Nuevo Profesor',
      'admin': 'Crear Nuevo Administrador'
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
      'student': 'Crear Estudiante',
      'profesor': 'Crear Profesor',
      'admin': 'Crear Administrador'
    };
    return textos[this.tipoUsuario];
  }

  cerrar(): void {
    this.formulario.reset();
    this.cerrarModal.emit();
  }

  crearUsuario(): void {
    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      return;
    }

    this.cargando = true;
    const datosUsuario: CreateUserRequest = {
      name: this.formulario.get('name')?.value,
      email: this.formulario.get('email')?.value,
      password: this.formulario.get('password')?.value,
      role: this.tipoUsuario,
      dni: this.tipoUsuario === 'student' ? this.formulario.get('dni')?.value : undefined,
      legajo: (this.tipoUsuario === 'student' || this.tipoUsuario === 'profesor') ? this.formulario.get('legajo')?.value : undefined,
      carrera: this.tipoUsuario === 'student' ? this.formulario.get('carrera')?.value : undefined,
      especialidad: this.tipoUsuario === 'profesor' ? this.formulario.get('especialidad')?.value : undefined,
      telefono: this.tipoUsuario === 'profesor' ? this.formulario.get('telefono')?.value : undefined,
      departamento: this.tipoUsuario === 'admin' ? this.formulario.get('departamento')?.value : undefined
    };

    this.userService.crearUsuario(datosUsuario).subscribe({
      next: (usuario) => {
        Swal.fire('¡Éxito!', `${this.getTituloModal().replace('Crear Nuevo', '')} creado correctamente`, 'success');
        this.usuarioCreado.emit(usuario);
        this.cerrar();
        this.cargando = false;
      },
      error: (error) => {
        console.error('Error al crear usuario:', error);
        const mensaje = error.error?.error || `No se pudo crear el ${this.tipoUsuario}`;
        Swal.fire('Error', mensaje, 'error');
        this.cargando = false;
      }
    });
  }
}
