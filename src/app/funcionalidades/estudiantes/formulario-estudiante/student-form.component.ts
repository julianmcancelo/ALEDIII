/**
 * @fileoverview Formulario de Estudiante - Componente para la gestión de estudiantes
 * 
 * Este componente permite crear y editar información de estudiantes en el sistema.
 * Incluye validación de formularios, manejo de estados de edición/creación,
 * y comunicación con el servicio de estudiantes.
 *
 * @author Sistema de Gestión Académica
 * @version 1.0.0
 */

import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { StudentService } from '../../../nucleo/servicios/student.service';
import { CarrerasService, Carrera } from '../../../nucleo/servicios/carreras.service';
import { Estudiante, CrearEstudianteRequest } from '../../../nucleo/modelos/student.model';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';

/**
 * Componente para el formulario de gestión de estudiantes
 * 
 * IMPORTANTE: Este componente es standalone y utiliza ReactiveFormsModule
 * para manejar la validación y envío del formulario.
 */
@Component({
  selector: 'app-formulario-estudiante',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="p-6">
      <div class="max-w-4xl mx-auto">
        <div class="bg-white rounded-lg shadow-lg">
          <div class="px-6 py-4 border-b border-gray-200">
            <h2 class="text-2xl font-bold text-gray-800">{{esEdicion ? 'Editar' : 'Nuevo'}} Estudiante</h2>
          </div>
          
          <div class="p-6">
            <form [formGroup]="formularioEstudiante" (ngSubmit)="enviarFormulario()" class="space-y-6">
              
              <!-- Información Personal -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Nombres</label>
                  <input 
                    type="text" 
                    formControlName="nombres" 
                    placeholder="Juan"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    [class.border-red-500]="formularioEstudiante.get('nombres')?.invalid && formularioEstudiante.get('nombres')?.touched">
                  <div *ngIf="formularioEstudiante.get('nombres')?.hasError('required') && formularioEstudiante.get('nombres')?.touched" 
                       class="mt-1 text-sm text-red-600">
                    El nombre es requerido
                  </div>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Apellidos</label>
                  <input 
                    type="text" 
                    formControlName="apellidos" 
                    placeholder="Pérez"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    [class.border-red-500]="formularioEstudiante.get('apellidos')?.invalid && formularioEstudiante.get('apellidos')?.touched">
                  <div *ngIf="formularioEstudiante.get('apellidos')?.hasError('required') && formularioEstudiante.get('apellidos')?.touched" 
                       class="mt-1 text-sm text-red-600">
                    El apellido es requerido
                  </div>
                </div>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input 
                    type="email" 
                    formControlName="email" 
                    placeholder="juan&#64;email.com"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                  <label class="block text-sm font-medium text-gray-700 mb-2">Teléfono</label>
                  <input 
                    type="tel" 
                    formControlName="telefono" 
                    placeholder="+54 11 1234-5678"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                </div>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">DNI</label>
                  <input 
                    type="text" 
                    formControlName="dni" 
                    placeholder="12345678"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    [class.border-red-500]="formularioEstudiante.get('dni')?.invalid && formularioEstudiante.get('dni')?.touched">
                  <div *ngIf="formularioEstudiante.get('dni')?.hasError('required') && formularioEstudiante.get('dni')?.touched" 
                       class="mt-1 text-sm text-red-600">
                    El DNI es requerido
                  </div>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Fecha de Nacimiento</label>
                  <input 
                    type="date" 
                    formControlName="fechaNacimiento"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    [class.border-red-500]="formularioEstudiante.get('fechaNacimiento')?.invalid && formularioEstudiante.get('fechaNacimiento')?.touched">
                  <div *ngIf="formularioEstudiante.get('fechaNacimiento')?.hasError('required') && formularioEstudiante.get('fechaNacimiento')?.touched" 
                       class="mt-1 text-sm text-red-600">
                    La fecha de nacimiento es requerida
                  </div>
                </div>
              </div>

              <!-- Información Académica -->
              <div class="border-t border-gray-200 pt-6">
                <h3 class="text-lg font-semibold text-gray-800 mb-4">Información Académica</h3>
                
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Legajo</label>
                    <input 
                      type="text" 
                      formControlName="legajo" 
                      placeholder="EST001"
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      [class.border-red-500]="formularioEstudiante.get('legajo')?.invalid && formularioEstudiante.get('legajo')?.touched">
                    <div *ngIf="formularioEstudiante.get('legajo')?.hasError('required') && formularioEstudiante.get('legajo')?.touched" 
                         class="mt-1 text-sm text-red-600">
                      El legajo es requerido
                    </div>
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Carrera</label>
                    <select 
                      formControlName="carrera_id"
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      [class.border-red-500]="formularioEstudiante.get('carrera_id')?.invalid && formularioEstudiante.get('carrera_id')?.touched">
                      <option value="">Seleccionar carrera</option>
                      <option *ngFor="let carrera of carreras" [value]="carrera.id">
                        {{carrera.nombre}}
                      </option>
                    </select>
                    <div *ngIf="formularioEstudiante.get('carrera_id')?.hasError('required') && formularioEstudiante.get('carrera_id')?.touched" 
                         class="mt-1 text-sm text-red-600">
                      La carrera es requerida
                    </div>
                  </div>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Fecha de Inscripción</label>
                    <input 
                      type="date" 
                      formControlName="fechaInscripcion"
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      [class.border-red-500]="formularioEstudiante.get('fechaInscripcion')?.invalid && formularioEstudiante.get('fechaInscripcion')?.touched">
                    <div *ngIf="formularioEstudiante.get('fechaInscripcion')?.hasError('required') && formularioEstudiante.get('fechaInscripcion')?.touched" 
                         class="mt-1 text-sm text-red-600">
                      La fecha de inscripción es requerida
                    </div>
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Estado</label>
                    <select 
                      formControlName="estado"
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                      <option value="activo">Activo</option>
                      <option value="inactivo">Inactivo</option>
                      <option value="graduado">Graduado</option>
                    </select>
                  </div>
                </div>
              </div>

              <!-- Dirección -->
              <div formGroupName="direccion" class="border-t border-gray-200 pt-6">
                <h3 class="text-lg font-semibold text-gray-800 mb-4">Dirección</h3>
                
                <div class="space-y-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Calle y Número</label>
                    <input 
                      type="text" 
                      formControlName="calle" 
                      placeholder="Av. Corrientes 1234"
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                  </div>

                  <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-2">Ciudad</label>
                      <input 
                        type="text" 
                        formControlName="ciudad" 
                        placeholder="Buenos Aires"
                        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                    </div>

                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-2">Provincia</label>
                      <input 
                        type="text" 
                        formControlName="provincia" 
                        placeholder="CABA"
                        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                    </div>

                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-2">Código Postal</label>
                      <input 
                        type="text" 
                        formControlName="codigoPostal" 
                        placeholder="1000"
                        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                    </div>
                  </div>
                </div>
              </div>

              <!-- Botones -->
              <div class="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                <button 
                  type="button" 
                  (click)="cancelar()"
                  class="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  [disabled]="formularioEstudiante.invalid"
                  class="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors">
                  {{esEdicion ? 'Actualizar' : 'Crear'}} Estudiante
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  `
})
/**
 * Componente FormularioEstudianteComponent
 * 
 * Este componente maneja tanto la creación como la edición de estudiantes.
 * Implementa un formulario reactivo con validaciones y manejo de estados.
 * 
 * @implements OnInit - Interfaz del ciclo de vida de Angular
 */
export class FormularioEstudianteComponent implements OnInit {
  formularioEstudiante: FormGroup;
  esEdicion = false;
  estudianteId: string | null = null;
  carreras: Carrera[] = [];

  /** Builder para la creación del formulario reactivo */
  private fb = inject(FormBuilder);
  /** Servicio para gestionar operaciones con estudiantes */
  private servicioEstudiante = inject(StudentService);
  private carrerasService = inject(CarrerasService);
  /** Router para navegación entre páginas */
  private router = inject(Router);
  /** Servicio para acceder a parámetros de la ruta */
  private ruta = inject(ActivatedRoute);

  constructor() {
    this.formularioEstudiante = this.crearFormulario();
  }

  /**
   * Inicializa el componente, comprueba si estamos en modo edición
   * y carga los datos del estudiante si es necesario
   */
  ngOnInit(): void {
    this.cargarCarreras();
    this.estudianteId = this.ruta.snapshot.paramMap.get('id');
    if (this.estudianteId) {
      this.esEdicion = true;
      this.servicioEstudiante.getEstudiantePorId(this.estudianteId).subscribe((estudiante: Estudiante) => {
        this.formularioEstudiante.patchValue({
          nombres: estudiante.nombres,
          apellidos: estudiante.apellidos,
          email: estudiante.email,
          telefono: estudiante.telefono,
          dni: estudiante.dni,
          fechaNacimiento: this.formatearFecha(estudiante.fechaNacimiento),
          legajo: estudiante.legajo,
          carrera_id: estudiante.carrera_id,
          fechaInscripcion: this.formatearFecha(estudiante.fechaInscripcion),
          estado: estudiante.estado,
          direccion: {
            calle: estudiante.direccion?.calle,
            ciudad: estudiante.direccion?.ciudad,
            provincia: estudiante.direccion?.provincia,
            codigoPostal: estudiante.direccion?.codigoPostal
          }
        });
      });
    }
  }

  private crearFormulario(): FormGroup {
    return this.fb.group({
      nombres: ['', [Validators.required]],
      apellidos: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      telefono: [''],
      dni: ['', [Validators.required]],
      fechaNacimiento: ['', [Validators.required]],
      legajo: ['', [Validators.required]],
      carrera_id: ['', [Validators.required]],
      fechaInscripcion: ['', [Validators.required]],
      estado: ['activo'],
      direccion: this.fb.group({
        calle: [''],
        ciudad: [''],
        provincia: [''],
        codigoPostal: ['']
      })
    });
  }

  /**
   * Maneja el envío del formulario
   * Valida el formulario, prepara los datos y realiza la petición al servidor
   * según sea un caso de creación o edición
   */
  enviarFormulario(): void {
    if (this.formularioEstudiante.valid) {
      const datosFormulario = this.formularioEstudiante.getRawValue();

      // Preparar los datos para enviar al servidor
      const datosEstudiante: CrearEstudianteRequest = {
        ...datosFormulario,
        fechaNacimiento: new Date(datosFormulario.fechaNacimiento),
        fechaInscripcion: new Date(datosFormulario.fechaInscripcion),
      };

      // Determinar si estamos actualizando o creando un estudiante
      const accion = this.esEdicion
        ? this.servicioEstudiante.actualizarEstudiante(this.estudianteId!, datosEstudiante)
        : this.servicioEstudiante.crearEstudiante(datosEstudiante);

      // Suscribirse para manejar la respuesta del servidor
      accion.subscribe({
        next: () => {
          const mensaje = this.esEdicion ? 'Estudiante actualizado' : 'Estudiante creado';
          Swal.fire('¡Éxito!', `${mensaje} correctamente.`, 'success');
          this.router.navigate(['/estudiantes']);
        },
        error: (err) => {
          const mensajeError = this.esEdicion ? 'actualizar' : 'crear';
          console.error(`Error al ${mensajeError} el estudiante:`, err);
          Swal.fire('Error', `No se pudo ${mensajeError} el estudiante.`, 'error');
        }
      });

    } else {
      this.formularioEstudiante.markAllAsTouched();
    }
  }

  /**
   * Cancela la operación actual y vuelve a la lista de estudiantes
   */
  cargarCarreras(): void {
    this.carrerasService.getCarreras().subscribe(carreras => {
      this.carreras = carreras;
    });
  }

  cancelar(): void {
    this.router.navigate(['/estudiantes']);
  }

  /**
   * Formatea una fecha para su uso en campos input[type=date]
   * 
   * @param fecha - La fecha a formatear
   * @returns Fecha formateada en formato YYYY-MM-DD
   */
  private formatearFecha(fecha: Date | string): string {
    if (!fecha) return '';
    const d = new Date(fecha);
    const mes = ('0' + (d.getMonth() + 1)).slice(-2);
    const dia = ('0' + d.getDate()).slice(-2);
    return `${d.getFullYear()}-${mes}-${dia}`;
  }
}
