/**
 * @file registro-usuario-mysql.component.ts
 * @description Componente para registro de usuarios b
 * 
 * TP Final Algoritmos y Estructuras de Datos III - 2025
 * Alumnos: CANCELO JULIAN - NICOLAS OTERO (Curso 3ra 1RA)
 * Profesor: Sebastian Saldivar
 */
import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { UserService } from '../../../nucleo/servicios/user.service';
import { CreateUserRequest, UserRole, Departamento } from '../../../nucleo/modelos/user.model';
import Swal from 'sweetalert2';

/**
 * @class RegistroUsuarioMySQLComponent
 * @description Componente para el registro de nuevos usuarios según estructura MySQL
 */
@Component({
  selector: 'app-registro-usuario-mysql',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div class="max-w-3xl w-full mx-auto">
        <!-- Encabezado -->
        <div class="text-center mb-8">
          <h1 class="text-3xl font-extrabold text-gray-900 mb-2">Registro de Usuario</h1>
          <p class="text-gray-600">Complete el formulario con los datos según la estructura MySQL</p>
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

        <!-- Formulario principal -->
        <div class="bg-white rounded-lg shadow-lg overflow-hidden">
          <div class="px-6 py-4 border-b border-gray-200" [ngClass]="{
            'bg-blue-50': tipoUsuario === 'student',
            'bg-green-50': tipoUsuario === 'profesor',
            'bg-red-50': tipoUsuario === 'admin'
          }">
            <h2 class="text-lg font-semibold text-gray-800">Datos según estructura MySQL</h2>
          </div>

          <div class="p-6">
            <form [formGroup]="usuarioForm" (ngSubmit)="registrarUsuario()" class="space-y-6">
              <!-- Campos comunes para todos los usuarios -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <!-- Email (varchar(255) NOT NULL UNIQUE) -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                  <input 
                    type="email" 
                    formControlName="email" 
                    placeholder="usuario@ibeltran.com.ar"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none"
                    [class.border-red-500]="usuarioForm.get('email')?.invalid && usuarioForm.get('email')?.touched">
                  <div *ngIf="usuarioForm.get('email')?.invalid && usuarioForm.get('email')?.touched">
                    <p *ngIf="usuarioForm.get('email')?.hasError('required')" class="mt-1 text-sm text-red-600">El email es obligatorio</p>
                    <p *ngIf="usuarioForm.get('email')?.hasError('email')" class="mt-1 text-sm text-red-600">El formato del email es inválido</p>
                    <p *ngIf="usuarioForm.get('email')?.hasError('maxlength')" class="mt-1 text-sm text-red-600">El email no debe exceder los 255 caracteres</p>
                  </div>
                </div>

                <!-- Nombre (varchar(255) NOT NULL) -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Nombre completo *</label>
                  <input 
                    type="text" 
                    formControlName="name" 
                    placeholder="Nombre y Apellido"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none"
                    [class.border-red-500]="usuarioForm.get('name')?.invalid && usuarioForm.get('name')?.touched">
                  <div *ngIf="usuarioForm.get('name')?.invalid && usuarioForm.get('name')?.touched">
                    <p *ngIf="usuarioForm.get('name')?.hasError('required')" class="mt-1 text-sm text-red-600">El nombre es obligatorio</p>
                    <p *ngIf="usuarioForm.get('name')?.hasError('maxlength')" class="mt-1 text-sm text-red-600">El nombre no debe exceder los 255 caracteres</p>
                  </div>
                </div>

                <!-- Contraseña (password_hash varchar(255) NOT NULL) -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Contraseña *</label>
                  <div class="relative">
                    <input 
                      [type]="mostrarContrasena ? 'text' : 'password'" 
                      formControlName="password" 
                      placeholder="Mínimo 8 caracteres"
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none"
                      [class.border-red-500]="usuarioForm.get('password')?.invalid && usuarioForm.get('password')?.touched">
                    <button 
                      type="button" 
                      class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                      (click)="toggleMostrarContrasena()">
                      <svg *ngIf="!mostrarContrasena" class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      <svg *ngIf="mostrarContrasena" class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                    </button>
                  </div>
                  <div *ngIf="usuarioForm.get('password')?.invalid && usuarioForm.get('password')?.touched">
                    <p *ngIf="usuarioForm.get('password')?.hasError('required')" class="mt-1 text-sm text-red-600">La contraseña es obligatoria</p>
                    <p *ngIf="usuarioForm.get('password')?.hasError('minlength')" class="mt-1 text-sm text-red-600">La contraseña debe tener al menos 8 caracteres</p>
                  </div>
                </div>

                <!-- DNI (varchar(20) NULL) -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">
                    DNI {{ tipoUsuario === 'student' ? '*' : '' }}
                  </label>
                  <input 
                    type="text" 
                    formControlName="dni" 
                    placeholder="12345678"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none"
                    [class.border-red-500]="usuarioForm.get('dni')?.invalid && usuarioForm.get('dni')?.touched">
                  <div *ngIf="usuarioForm.get('dni')?.invalid && usuarioForm.get('dni')?.touched">
                    <p *ngIf="usuarioForm.get('dni')?.hasError('required')" class="mt-1 text-sm text-red-600">El DNI es obligatorio para estudiantes</p>
                    <p *ngIf="usuarioForm.get('dni')?.hasError('maxlength')" class="mt-1 text-sm text-red-600">El DNI no debe exceder los 20 caracteres</p>
                    <p *ngIf="usuarioForm.get('dni')?.hasError('pattern')" class="mt-1 text-sm text-red-600">El DNI debe contener solo números</p>
                  </div>
                </div>
              </div>

              <!-- Campos específicos según el rol -->
              <div [ngSwitch]="tipoUsuario">
                <!-- Campos para estudiantes -->
                <div *ngSwitchCase="'student'" class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <!-- Legajo (varchar(20) NULL) -->
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Legajo/Matrícula *</label>
                    <input 
                      type="text" 
                      formControlName="legajo" 
                      placeholder="EST-12345"
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none"
                      [class.border-red-500]="usuarioForm.get('legajo')?.invalid && usuarioForm.get('legajo')?.touched">
                    <div *ngIf="usuarioForm.get('legajo')?.invalid && usuarioForm.get('legajo')?.touched">
                      <p *ngIf="usuarioForm.get('legajo')?.hasError('required')" class="mt-1 text-sm text-red-600">El legajo es obligatorio para estudiantes</p>
                      <p *ngIf="usuarioForm.get('legajo')?.hasError('maxlength')" class="mt-1 text-sm text-red-600">El legajo no debe exceder los 20 caracteres</p>
                    </div>
                  </div>

                  <!-- Carrera (varchar(100) NULL) -->
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Carrera *</label>
                    <select 
                      formControlName="carrera" 
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none"
                      [class.border-red-500]="usuarioForm.get('carrera')?.invalid && usuarioForm.get('carrera')?.touched">
                      <option value="">Seleccione una carrera</option>
                      <option value="Sistemas">Sistemas</option>
                      <option value="Enfermería">Enfermería</option>
                      <option value="Radiología">Radiología</option>
                      <option value="Higiene y Seguridad">Higiene y Seguridad</option>
                      <option value="Comunicación Multimedial">Comunicación Multimedial</option>
                      <option value="Diseño Industrial">Diseño Industrial</option>
                      <option value="Administración de Pymes">Administración de Pymes</option>
                      <option value="Contable">Contable</option>
                      <option value="Ciencia de Datos e IA">Ciencia de Datos e IA</option>
                    </select>
                    <div *ngIf="usuarioForm.get('carrera')?.invalid && usuarioForm.get('carrera')?.touched">
                      <p *ngIf="usuarioForm.get('carrera')?.hasError('required')" class="mt-1 text-sm text-red-600">La carrera es obligatoria para estudiantes</p>
                    </div>
                  </div>

                  <!-- Teléfono (varchar(20) NULL) -->
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
                    <input 
                      type="tel" 
                      formControlName="telefono" 
                      placeholder="+54 11 1234-5678"
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none"
                      [class.border-red-500]="usuarioForm.get('telefono')?.invalid && usuarioForm.get('telefono')?.touched">
                    <div *ngIf="usuarioForm.get('telefono')?.invalid && usuarioForm.get('telefono')?.touched">
                      <p *ngIf="usuarioForm.get('telefono')?.hasError('maxlength')" class="mt-1 text-sm text-red-600">El teléfono no debe exceder los 20 caracteres</p>
                    </div>
                  </div>
                </div>

                <!-- Campos para profesores -->
                <div *ngSwitchCase="'profesor'" class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <!-- Legajo (varchar(20) NULL) -->
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Legajo/Matrícula *</label>
                    <input 
                      type="text" 
                      formControlName="legajo" 
                      placeholder="PROF-12345"
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none"
                      [class.border-red-500]="usuarioForm.get('legajo')?.invalid && usuarioForm.get('legajo')?.touched">
                    <div *ngIf="usuarioForm.get('legajo')?.invalid && usuarioForm.get('legajo')?.touched">
                      <p *ngIf="usuarioForm.get('legajo')?.hasError('required')" class="mt-1 text-sm text-red-600">El legajo es obligatorio para profesores</p>
                      <p *ngIf="usuarioForm.get('legajo')?.hasError('maxlength')" class="mt-1 text-sm text-red-600">El legajo no debe exceder los 20 caracteres</p>
                    </div>
                  </div>

                  <!-- Especialidad (varchar(100) NULL) -->
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Especialidad *</label>
                    <input 
                      type="text" 
                      formControlName="especialidad" 
                      placeholder="Ej. Matemáticas, Programación, etc."
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none"
                      [class.border-red-500]="usuarioForm.get('especialidad')?.invalid && usuarioForm.get('especialidad')?.touched">
                    <div *ngIf="usuarioForm.get('especialidad')?.invalid && usuarioForm.get('especialidad')?.touched">
                      <p *ngIf="usuarioForm.get('especialidad')?.hasError('required')" class="mt-1 text-sm text-red-600">La especialidad es obligatoria para profesores</p>
                      <p *ngIf="usuarioForm.get('especialidad')?.hasError('maxlength')" class="mt-1 text-sm text-red-600">La especialidad no debe exceder los 100 caracteres</p>
                    </div>
                  </div>

                  <!-- Teléfono (varchar(20) NULL) -->
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Teléfono *</label>
                    <input 
                      type="tel" 
                      formControlName="telefono" 
                      placeholder="+54 11 1234-5678"
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none"
                      [class.border-red-500]="usuarioForm.get('telefono')?.invalid && usuarioForm.get('telefono')?.touched">
                    <div *ngIf="usuarioForm.get('telefono')?.invalid && usuarioForm.get('telefono')?.touched">
                      <p *ngIf="usuarioForm.get('telefono')?.hasError('required')" class="mt-1 text-sm text-red-600">El teléfono es obligatorio para profesores</p>
                      <p *ngIf="usuarioForm.get('telefono')?.hasError('maxlength')" class="mt-1 text-sm text-red-600">El teléfono no debe exceder los 20 caracteres</p>
                    </div>
                  </div>
                </div>

                <!-- Campos para administradores -->
                <div *ngSwitchCase="'admin'" class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <!-- Departamento (enum('Dirección','Secretaría','Administración','Sistemas') NULL) -->
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Departamento *</label>
                    <select 
                      formControlName="departamento" 
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none"
                      [class.border-red-500]="usuarioForm.get('departamento')?.invalid && usuarioForm.get('departamento')?.touched">
                      <option value="">Seleccione un departamento</option>
                      <option value="Dirección">Dirección</option>
                      <option value="Secretaría">Secretaría</option>
                      <option value="Administración">Administración</option>
                      <option value="Sistemas">Sistemas</option>
                    </select>
                    <div *ngIf="usuarioForm.get('departamento')?.invalid && usuarioForm.get('departamento')?.touched">
                      <p *ngIf="usuarioForm.get('departamento')?.hasError('required')" class="mt-1 text-sm text-red-600">El departamento es obligatorio para administradores</p>
                    </div>
                  </div>

                  <!-- Teléfono (varchar(20) NULL) -->
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Teléfono *</label>
                    <input 
                      type="tel" 
                      formControlName="telefono" 
                      placeholder="+54 11 1234-5678"
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none"
                      [class.border-red-500]="usuarioForm.get('telefono')?.invalid && usuarioForm.get('telefono')?.touched">
                    <div *ngIf="usuarioForm.get('telefono')?.invalid && usuarioForm.get('telefono')?.touched">
                      <p *ngIf="usuarioForm.get('telefono')?.hasError('required')" class="mt-1 text-sm text-red-600">El teléfono es obligatorio para administradores</p>
                      <p *ngIf="usuarioForm.get('telefono')?.hasError('maxlength')" class="mt-1 text-sm text-red-600">El teléfono no debe exceder los 20 caracteres</p>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Botones del formulario -->
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
                <button 
                  type="button"
                  (click)="cancelar()"
                  class="w-full py-3 px-4 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 focus:outline-none transition-colors">
                  Cancelar
                </button>
                
                <button 
                  type="submit"
                  [disabled]="usuarioForm.invalid || enviando"
                  class="w-full py-3 px-4 rounded-lg font-medium text-white transition-colors disabled:opacity-50"
                  [ngClass]="{
                    'bg-blue-600 hover:bg-blue-700': tipoUsuario === 'student',
                    'bg-green-600 hover:bg-green-700': tipoUsuario === 'profesor',
                    'bg-red-600 hover:bg-red-700': tipoUsuario === 'admin'
                  }">
                  <span *ngIf="!enviando">Registrar Usuario</span>
                  <div *ngIf="enviando" class="flex items-center justify-center">
                    <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Registrando...</span>
                  </div>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class RegistroUsuarioMySQLComponent implements OnInit {
  // Formulario reactivo
  usuarioForm: FormGroup;
  
  // Tipo de usuario seleccionado
  tipoUsuario: UserRole = 'student';
  
  // Estado del formulario
  enviando = false;
  mostrarContrasena = false;
  
  // Inyección de dependencias
  private fb = inject(FormBuilder);
  private userService = inject(UserService);
  private router = inject(Router);
  
  constructor() {
    // Inicializar el formulario con validaciones
    this.usuarioForm = this.fb.group({
      // Campos comunes (requeridos)
      email: ['', [
        Validators.required, 
        Validators.email, 
        Validators.maxLength(255)
      ]],
      name: ['', [
        Validators.required, 
        Validators.maxLength(255)
      ]],
      password: ['', [
        Validators.required, 
        Validators.minLength(8)
      ]],
      
      // Campos opcionales según el rol
      dni: ['', [
        Validators.maxLength(20),
        Validators.pattern('^[0-9]*$')
      ]],
      legajo: ['', [
        Validators.maxLength(20)
      ]],
      carrera: ['', [
        Validators.maxLength(100)
      ]],
      especialidad: ['', [
        Validators.maxLength(100)
      ]],
      telefono: ['', [
        Validators.maxLength(20)
      ]],
      departamento: ['']
    });
  }
  
  ngOnInit(): void {
    // Configurar validaciones iniciales según el tipo de usuario
    this.actualizarValidaciones();
  }
  
  /**
   * Cambia el tipo de usuario seleccionado y actualiza validaciones
   */
  cambiarTipoUsuario(tipo: UserRole): void {
    this.tipoUsuario = tipo;
    this.actualizarValidaciones();
    
    // Reiniciar campos específicos
    this.usuarioForm.patchValue({
      legajo: '',
      carrera: '',
      especialidad: '',
      departamento: ''
    });
  }
  
  /**
   * Actualiza las validaciones del formulario según el tipo de usuario
   */
  private actualizarValidaciones(): void {
    // Obtener controles del formulario
    const dniControl = this.usuarioForm.get('dni');
    const legajoControl = this.usuarioForm.get('legajo');
    const carreraControl = this.usuarioForm.get('carrera');
    const especialidadControl = this.usuarioForm.get('especialidad');
    const telefonoControl = this.usuarioForm.get('telefono');
    const departamentoControl = this.usuarioForm.get('departamento');
    
    // Limpiar validaciones anteriores
    dniControl?.clearValidators();
    legajoControl?.clearValidators();
    carreraControl?.clearValidators();
    especialidadControl?.clearValidators();
    telefonoControl?.clearValidators();
    departamentoControl?.clearValidators();
    
    // Establecer validaciones comunes
    dniControl?.setValidators([Validators.maxLength(20), Validators.pattern('^[0-9]*$')]);
    legajoControl?.setValidators([Validators.maxLength(20)]);
    telefonoControl?.setValidators([Validators.maxLength(20)]);
    
    // Establecer validaciones específicas según el rol
    switch(this.tipoUsuario) {
      case 'student':
        dniControl?.addValidators(Validators.required);
        legajoControl?.addValidators(Validators.required);
        carreraControl?.setValidators([Validators.required, Validators.maxLength(100)]);
        break;
        
      case 'profesor':
        legajoControl?.addValidators(Validators.required);
        especialidadControl?.setValidators([Validators.required, Validators.maxLength(100)]);
        telefonoControl?.addValidators(Validators.required);
        break;
        
      case 'admin':
        departamentoControl?.setValidators(Validators.required);
        telefonoControl?.addValidators(Validators.required);
        break;
    }
    
    // Actualizar el estado de los controles
    dniControl?.updateValueAndValidity();
    legajoControl?.updateValueAndValidity();
    carreraControl?.updateValueAndValidity();
    especialidadControl?.updateValueAndValidity();
    telefonoControl?.updateValueAndValidity();
    departamentoControl?.updateValueAndValidity();
  }
  
  /**
   * Alterna la visibilidad de la contraseña
   */
  toggleMostrarContrasena(): void {
    this.mostrarContrasena = !this.mostrarContrasena;
  }
  
  /**
   * Procesa el formulario y registra el usuario
   */
  registrarUsuario(): void {
    if (this.usuarioForm.invalid) {
      // Marcar todos los campos como tocados para mostrar errores
      this.usuarioForm.markAllAsTouched();
      return;
    }
    
    this.enviando = true;
    
    // Crear objeto de datos para enviar al backend
    const datosUsuario: CreateUserRequest = {
      email: this.usuarioForm.get('email')?.value,
      name: this.usuarioForm.get('name')?.value,
      password: this.usuarioForm.get('password')?.value,
      role: this.tipoUsuario
    };
    
    // Añadir campos específicos según el rol
    if (this.usuarioForm.get('dni')?.value) {
      datosUsuario.dni = this.usuarioForm.get('dni')?.value;
    }
    
    if (this.usuarioForm.get('legajo')?.value) {
      datosUsuario.legajo = this.usuarioForm.get('legajo')?.value;
    }
    
    if (this.tipoUsuario === 'student' && this.usuarioForm.get('carrera')?.value) {
      datosUsuario.carrera = this.usuarioForm.get('carrera')?.value;
    }
    
    if (this.tipoUsuario === 'profesor' && this.usuarioForm.get('especialidad')?.value) {
      datosUsuario.especialidad = this.usuarioForm.get('especialidad')?.value;
    }
    
    if (this.usuarioForm.get('telefono')?.value) {
      datosUsuario.telefono = this.usuarioForm.get('telefono')?.value;
    }
    
    if (this.tipoUsuario === 'admin' && this.usuarioForm.get('departamento')?.value) {
      datosUsuario.departamento = this.usuarioForm.get('departamento')?.value as Departamento;
    }
    
    // Enviar datos al servicio
    this.userService.crearUsuario(datosUsuario).subscribe({
      next: (usuario) => {
        Swal.fire({
          icon: 'success',
          title: 'Usuario registrado correctamente',
          text: `El ${this.tipoUsuario} "${usuario.name}" ha sido registrado en el sistema`,
          confirmButtonText: 'Aceptar'
        }).then(() => {
          // Redirigir a la lista de usuarios
          this.router.navigate(['/gestion-usuarios']);
        });
        this.enviando = false;
      },
      error: (error) => {
        console.error('Error al registrar usuario:', error);
        
        let mensaje = 'No se pudo registrar el usuario';
        
        // Manejar errores específicos
        if (error.status === 409) {
          mensaje = 'Ya existe un usuario con ese email';
        } else if (error.error?.message) {
          mensaje = error.error.message;
        }
        
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: mensaje,
          confirmButtonText: 'Entendido'
        });
        
        this.enviando = false;
      }
    });
  }
  
  /**
   * Navega a la lista de usuarios
   */
  cancelar(): void {
    this.router.navigate(['/gestion-usuarios']);
  }
}
