import { Component, OnInit, OnChanges, inject, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UserService, Usuario, CrearUsuarioRequest } from '../../../../nucleo/servicios/user.service';
import { CarrerasService, Carrera } from '../../../../nucleo/servicios/carreras.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-modal-estudiante',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <!-- Modal Backdrop -->
    <div *ngIf="mostrar" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        
        <!-- Header del Modal -->
        <div class="bg-gradient-to-r from-indigo-600 to-purple-600 px-8 py-6 rounded-t-2xl">
          <div class="flex justify-between items-center">
            <div>
              <h2 class="text-2xl font-bold text-white">
                {{esEdicion ? 'Editar' : 'Nuevo'}} Estudiante
              </h2>
              <p class="text-indigo-100 mt-1">
                {{esEdicion ? 'Modifica la información del estudiante' : 'Completa los datos del nuevo estudiante'}}
              </p>
            </div>
            <button (click)="cerrar()" 
                    class="text-white hover:text-indigo-200 transition-colors">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
        </div>

        <!-- Contenido del Modal -->
        <div class="p-8">
          <!-- Navegación de Tabs -->
          <div class="border-b border-gray-200 mb-6">
            <nav class="-mb-px flex space-x-8">
              <button
                type="button"
                (click)="cambiarTab(0)"
                [class]="tabActiva === 0 ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'"
                class="whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm transition-colors duration-200">
                <svg class="w-5 h-5 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                </svg>
                Datos Personales
              </button>
              <button
                type="button"
                (click)="cambiarTab(1)"
                [class]="tabActiva === 1 ? 'border-green-500 text-green-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'"
                class="whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm transition-colors duration-200">
                <svg class="w-5 h-5 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 14l9-5-9-5-9 5 9 5z"></path>
                </svg>
                Datos Académicos
              </button>
              <button
                type="button"
                (click)="cambiarTab(2)"
                [class]="tabActiva === 2 ? 'border-purple-500 text-purple-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'"
                class="whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm transition-colors duration-200">
                <svg class="w-5 h-5 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                </svg>
                Dirección
              </button>
              <button
                type="button"
                (click)="cambiarTab(3)"
                [class]="tabActiva === 3 ? 'border-orange-500 text-orange-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'"
                class="whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm transition-colors duration-200">
                <svg class="w-5 h-5 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                </svg>
                Contacto Emergencia
              </button>
            </nav>
          </div>

          <form [formGroup]="formularioEstudiante" (ngSubmit)="guardar()" class="space-y-8">
            
            <!-- Tab 0: Datos Personales -->
            <div *ngIf="tabActiva === 0" class="bg-blue-50 rounded-xl p-6 border-l-4 border-blue-500">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label class="block text-sm font-semibold text-gray-700 mb-2">Nombres *</label>
                  <input 
                    type="text" 
                    formControlName="name" 
                    placeholder="Juan Carlos"
                    class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                    [class.border-red-500]="formularioEstudiante.get('name')?.invalid && formularioEstudiante.get('name')?.touched">
                  <div *ngIf="formularioEstudiante.get('name')?.hasError('required') && formularioEstudiante.get('name')?.touched" 
                       class="mt-1 text-sm text-red-600">
                    El nombre es requerido
                  </div>
                </div>

                <div>
                  <label class="block text-sm font-semibold text-gray-700 mb-2">Apellidos *</label>
                  <input 
                    type="text" 
                    formControlName="apellidos" 
                    placeholder="García López"
                    class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                    [class.border-red-500]="formularioEstudiante.get('apellidos')?.invalid && formularioEstudiante.get('apellidos')?.touched">
                  <div *ngIf="formularioEstudiante.get('apellidos')?.hasError('required') && formularioEstudiante.get('apellidos')?.touched" 
                       class="mt-1 text-sm text-red-600">
                    Los apellidos son requeridos
                  </div>
                </div>

                <div>
                  <label class="block text-sm font-semibold text-gray-700 mb-2">Email *</label>
                  <input 
                    type="email" 
                    formControlName="email" 
                    placeholder="juan@email.com"
                    class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                    [class.border-red-500]="formularioEstudiante.get('email')?.invalid && formularioEstudiante.get('email')?.touched">
                  <div *ngIf="formularioEstudiante.get('email')?.hasError('required') && formularioEstudiante.get('email')?.touched" 
                       class="mt-1 text-sm text-red-600">
                    El email es requerido
                  </div>
                  <div *ngIf="formularioEstudiante.get('email')?.hasError('email') && formularioEstudiante.get('email')?.touched" 
                       class="mt-1 text-sm text-red-600">
                    Ingresa un email válido
                  </div>
                </div>

                <div>
                  <label class="block text-sm font-semibold text-gray-700 mb-2">DNI *</label>
                  <input 
                    type="text" 
                    formControlName="dni" 
                    placeholder="12345678"
                    class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                    [class.border-red-500]="formularioEstudiante.get('dni')?.invalid && formularioEstudiante.get('dni')?.touched">
                  <div *ngIf="formularioEstudiante.get('dni')?.hasError('required') && formularioEstudiante.get('dni')?.touched" 
                       class="mt-1 text-sm text-red-600">
                    El DNI es requerido
                  </div>
                </div>

                <div>
                  <label class="block text-sm font-semibold text-gray-700 mb-2">Fecha de Nacimiento *</label>
                  <input 
                    type="date" 
                    formControlName="fechaNacimiento"
                    class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                    [class.border-red-500]="formularioEstudiante.get('fechaNacimiento')?.invalid && formularioEstudiante.get('fechaNacimiento')?.touched">
                  <div *ngIf="formularioEstudiante.get('fechaNacimiento')?.hasError('required') && formularioEstudiante.get('fechaNacimiento')?.touched" 
                       class="mt-1 text-sm text-red-600">
                    La fecha de nacimiento es requerida
                  </div>
                </div>

                <div>
                  <label class="block text-sm font-semibold text-gray-700 mb-2">Teléfono</label>
                  <input 
                    type="tel" 
                    formControlName="telefono" 
                    placeholder="+54 11 1234-5678"
                    class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200">
                </div>
              </div>
            </div>

            <!-- Tab 1: Datos Académicos -->
            <div *ngIf="tabActiva === 1" class="bg-green-50 rounded-xl p-6 border-l-4 border-green-500">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label class="block text-sm font-semibold text-gray-700 mb-2">Legajo *</label>
                  <input 
                    type="text" 
                    formControlName="legajo" 
                    placeholder="EST001"
                    class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
                    [class.border-red-500]="formularioEstudiante.get('legajo')?.invalid && formularioEstudiante.get('legajo')?.touched">
                  <div *ngIf="formularioEstudiante.get('legajo')?.hasError('required') && formularioEstudiante.get('legajo')?.touched" 
                       class="mt-1 text-sm text-red-600">
                    El legajo es requerido
                  </div>
                </div>

                <div>
                  <label class="block text-sm font-semibold text-gray-700 mb-2">Carrera *</label>
                  <select 
                    formControlName="carrera_id"
                    class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
                    [class.border-red-500]="formularioEstudiante.get('carrera_id')?.invalid && formularioEstudiante.get('carrera_id')?.touched">
                    <option value="">Seleccionar carrera</option>
                    <option *ngFor="let carrera of carreras" [value]="carrera.id">
                      {{carrera.nombre}} ({{carrera.duracion_anios}} años)
                    </option>
                  </select>
                  <div *ngIf="formularioEstudiante.get('carrera_id')?.hasError('required') && formularioEstudiante.get('carrera_id')?.touched" 
                       class="mt-1 text-sm text-red-600">
                    La carrera es requerida
                  </div>
                </div>


                <div>
                  <label class="block text-sm font-semibold text-gray-700 mb-2">Departamento</label>
                  <select 
                    formControlName="departamento"
                    class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200">
                    <option value="">Seleccionar departamento</option>
                    <option value="Dirección">Dirección</option>
                    <option value="Secretaría">Secretaría</option>
                    <option value="Administración">Administración</option>
                    <option value="Sistemas">Sistemas</option>
                  </select>
                </div>

                <div>
                  <label class="block text-sm font-semibold text-gray-700 mb-2">Fecha de Inscripción *</label>
                  <input 
                    type="date" 
                    formControlName="fechaInscripcion"
                    class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
                    [class.border-red-500]="formularioEstudiante.get('fechaInscripcion')?.invalid && formularioEstudiante.get('fechaInscripcion')?.touched">
                  <div *ngIf="formularioEstudiante.get('fechaInscripcion')?.hasError('required') && formularioEstudiante.get('fechaInscripcion')?.touched" 
                       class="mt-1 text-sm text-red-600">
                    La fecha de inscripción es requerida
                  </div>
                </div>

                <div>
                  <label class="block text-sm font-semibold text-gray-700 mb-2">Estado</label>
                  <select 
                    formControlName="estado"
                    class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200">
                    <option value="activo">Activo</option>
                    <option value="inactivo">Inactivo</option>
                    <option value="graduado">Graduado</option>
                  </select>
                </div>
              </div>
            </div>

            <!-- Tab 2: Dirección -->
            <div *ngIf="tabActiva === 2" class="bg-purple-50 rounded-xl p-6 border-l-4 border-purple-500">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="md:col-span-2">
                  <label class="block text-sm font-semibold text-gray-700 mb-2">Calle y Número</label>
                  <input 
                    type="text" 
                    formControlName="calle" 
                    placeholder="Av. Corrientes 1234"
                    class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200">
                </div>

                <div>
                  <label class="block text-sm font-semibold text-gray-700 mb-2">Ciudad</label>
                  <input 
                    type="text" 
                    formControlName="ciudad" 
                    placeholder="Buenos Aires"
                    class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200">
                </div>

                <div>
                  <label class="block text-sm font-semibold text-gray-700 mb-2">Provincia</label>
                  <input 
                    type="text" 
                    formControlName="provincia" 
                    placeholder="CABA"
                    class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200">
                </div>

                <div>
                  <label class="block text-sm font-semibold text-gray-700 mb-2">Código Postal</label>
                  <input 
                    type="text" 
                    formControlName="codigoPostal" 
                    placeholder="1000"
                    class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200">
                </div>
              </div>
            </div>

            <!-- Tab 3: Contacto de Emergencia -->
            <div *ngIf="tabActiva === 3" class="bg-orange-50 rounded-xl p-6 border-l-4 border-orange-500">
              <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label class="block text-sm font-semibold text-gray-700 mb-2">Nombre Completo</label>
                  <input 
                    type="text" 
                    formControlName="contacto_emergencia_nombre" 
                    placeholder="María García"
                    class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200">
                </div>

                <div>
                  <label class="block text-sm font-semibold text-gray-700 mb-2">Teléfono</label>
                  <input 
                    type="tel" 
                    formControlName="contacto_emergencia_telefono" 
                    placeholder="+54 11 9876-5432"
                    class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200">
                </div>

                <div>
                  <label class="block text-sm font-semibold text-gray-700 mb-2">Parentesco</label>
                  <input 
                    type="text" 
                    formControlName="contacto_emergencia_parentesco" 
                    placeholder="Madre"
                    class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200">
                </div>
              </div>
            </div>

            <!-- Botones -->
            <div class="flex justify-end space-x-4 pt-6 border-t border-gray-200">
              <button 
                type="button" 
                (click)="cerrar()"
                class="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all duration-200 font-semibold">
                Cancelar
              </button>
              <button 
                type="submit" 
                [disabled]="formularioEstudiante.invalid || guardando"
                class="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-semibold shadow-lg">
                <span *ngIf="!guardando">{{esEdicion ? 'Actualizar' : 'Crear'}} Estudiante</span>
                <span *ngIf="guardando" class="flex items-center">
                  <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Guardando...
                </span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `
})
export class ModalEstudianteComponent implements OnInit, OnChanges {
  @Input() mostrar = false;
  @Input() estudiante: Usuario | null = null;
  @Output() cerrado = new EventEmitter<void>();
  @Output() estudianteGuardado = new EventEmitter<void>();

  formularioEstudiante!: FormGroup;
  esEdicion = false;
  guardando = false;
  carreras: Carrera[] = [];

  private fb = inject(FormBuilder);
  private userService = inject(UserService);
  private carrerasService = inject(CarrerasService);

  constructor() {
    this.inicializarFormulario();
  }

  ngOnInit(): void {
    this.cargarCarreras();
  }

  ngOnChanges(): void {
    if (this.estudiante) {
      this.esEdicion = true;
      this.cargarDatosEstudiante();
    } else {
      this.esEdicion = false;
      this.formularioEstudiante.reset();
      this.formularioEstudiante.patchValue({
        estado: 'activo',
        role: 'student'
      });
    }
  }

  tabActiva = 0;

  private inicializarFormulario(): void {
    this.formularioEstudiante = this.fb.group({
      name: ['', [Validators.required]],
      apellidos: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      dni: ['', [Validators.required]],
      legajo: ['', [Validators.required]],
      carrera_id: ['', [Validators.required]],
      telefono: [''],
      departamento: [''],
      fechaNacimiento: ['', [Validators.required]],
      fechaInscripcion: ['', [Validators.required]],
      estado: ['activo'],
      calle: [''],
      ciudad: [''],
      provincia: [''],
      codigoPostal: [''],
      contacto_emergencia_nombre: [''],
      contacto_emergencia_telefono: [''],
      contacto_emergencia_parentesco: ['']
    });
  }

  cambiarTab(index: number): void {
    this.tabActiva = index;
  }

  private cargarCarreras(): void {
    this.carrerasService.getCarreras().subscribe({
      next: (carreras: Carrera[]) => {
        this.carreras = carreras;
      },
      error: (error: any) => {
        console.error('Error al cargar carreras:', error);
      }
    });
  }

  private cargarDatosEstudiante(): void {
    if (this.estudiante) {
      this.formularioEstudiante.patchValue({
        name: this.estudiante.name,
        apellidos: this.estudiante.apellidos,
        email: this.estudiante.email,
        dni: this.estudiante.dni,
        legajo: this.estudiante.legajo,
        carrera_id: this.estudiante.carrera_id,
        telefono: this.estudiante.telefono,
        departamento: this.estudiante.departamento,
        fechaNacimiento: this.estudiante.fechaNacimiento ? this.formatearFecha(this.estudiante.fechaNacimiento) : '',
        fechaInscripcion: this.estudiante.fechaInscripcion ? this.formatearFecha(this.estudiante.fechaInscripcion) : '',
        estado: this.estudiante.estado,
        calle: this.estudiante.calle,
        ciudad: this.estudiante.ciudad,
        provincia: this.estudiante.provincia,
        codigoPostal: this.estudiante.codigoPostal,
        contacto_emergencia_nombre: this.estudiante.contacto_emergencia_nombre,
        contacto_emergencia_telefono: this.estudiante.contacto_emergencia_telefono,
        contacto_emergencia_parentesco: this.estudiante.contacto_emergencia_parentesco
      });
    }
  }

  guardar(): void {
    if (this.formularioEstudiante.invalid) {
      this.formularioEstudiante.markAllAsTouched();
      return;
    }

    this.guardando = true;
    const datosFormulario = this.formularioEstudiante.getRawValue();

    const datosEstudiante: CrearUsuarioRequest = {
      ...datosFormulario,
      role: 'student',
      password: this.esEdicion ? undefined : 'estudiante123' // No se actualiza la contraseña en la edición
    };

    if (this.esEdicion) {
      // MODO EDICIÓN
      this.userService.updateUser(this.estudiante!.id, datosEstudiante).subscribe({
        next: () => {
          this.guardando = false;
          Swal.fire('¡Éxito!', 'Estudiante actualizado correctamente.', 'success');
          this.estudianteGuardado.emit();
          this.cerrar();
        },
        error: (error: any) => {
          this.guardando = false;
          console.error('Error al actualizar estudiante:', error);
          Swal.fire('Error', 'No se pudo actualizar el estudiante.', 'error');
        }
      });
    } else {
      // MODO CREACIÓN
      this.userService.crearUsuario(datosEstudiante).subscribe({
        next: () => {
          this.guardando = false;
          Swal.fire('¡Éxito!', 'Estudiante creado correctamente.', 'success');
          this.estudianteGuardado.emit();
          this.cerrar();
        },
        error: (error: any) => {
          this.guardando = false;
          console.error('Error al crear estudiante:', error);
          Swal.fire('Error', 'No se pudo crear el estudiante.', 'error');
        }
      });
    }
  }

  cerrar(): void {
    this.mostrar = false;
    this.formularioEstudiante.reset();
    this.cerrado.emit();
  }

  private formatearFecha(fecha: string | Date): string {
    if (!fecha) return '';
    const d = new Date(fecha);
    const mes = ('0' + (d.getMonth() + 1)).slice(-2);
    const dia = ('0' + d.getDate()).slice(-2);
    return `${d.getFullYear()}-${mes}-${dia}`;
  }
}
