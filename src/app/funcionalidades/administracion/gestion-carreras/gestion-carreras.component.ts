import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CarrerasService, Carrera, CrearCarreraRequest } from '../../../nucleo/servicios/carreras.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-gestion-carreras',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="p-6">
      <div class="max-w-6xl mx-auto">
        <!-- Header -->
        <div class="bg-white rounded-lg shadow-lg mb-6">
          <div class="px-6 py-4 border-b border-gray-200">
            <h2 class="text-2xl font-bold text-gray-800">Gestión de Carreras</h2>
            <p class="text-gray-600 mt-1">Administrar carreras del Instituto Beltrán</p>
          </div>
        </div>

        <!-- Formulario para crear/editar carrera -->
        <div class="bg-white rounded-lg shadow-lg mb-6">
          <div class="px-6 py-4 border-b border-gray-200">
            <h3 class="text-lg font-semibold text-gray-800">
              {{ editandoCarrera ? 'Editar Carrera' : 'Nueva Carrera' }}
            </h3>
          </div>
          
          <div class="p-6">
            <form [formGroup]="formulario" (ngSubmit)="guardarCarrera()" class="space-y-4">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Nombre de la Carrera *</label>
                  <input 
                    type="text" 
                    formControlName="nombre" 
                    placeholder="Técnico en Informática"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    [class.border-red-500]="formulario.get('nombre')?.invalid && formulario.get('nombre')?.touched">
                  <div *ngIf="formulario.get('nombre')?.hasError('required') && formulario.get('nombre')?.touched" 
                       class="mt-1 text-sm text-red-600">
                    El nombre es requerido
                  </div>
                </div>
                
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Duración (años) *</label>
                  <select 
                    formControlName="duracion_anios"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    <option value="1">1 año</option>
                    <option value="2">2 años</option>
                    <option value="3">3 años</option>
                    <option value="4">4 años</option>
                    <option value="5">5 años</option>
                    <option value="6">6 años</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Descripción</label>
                <textarea 
                  formControlName="descripcion" 
                  rows="3"
                  placeholder="Descripción de la carrera..."
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                </textarea>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Estado</label>
                <select 
                  formControlName="estado"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  <option value="activa">Activa</option>
                  <option value="inactiva">Inactiva</option>
                </select>
              </div>
              
              <div class="flex justify-end space-x-3">
                <button 
                  *ngIf="editandoCarrera"
                  type="button"
                  (click)="cancelarEdicion()"
                  class="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                  Cancelar
                </button>
                <button 
                  type="submit"
                  [disabled]="formulario.invalid || cargando"
                  class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                  <span *ngIf="cargando" class="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span>
                  {{ editandoCarrera ? 'Actualizar' : 'Crear' }} Carrera
                </button>
              </div>
            </form>
          </div>
        </div>

        <!-- Lista de carreras -->
        <div class="bg-white rounded-lg shadow-lg">
          <div class="px-6 py-4 border-b border-gray-200">
            <h3 class="text-lg font-semibold text-gray-800">Carreras Registradas</h3>
          </div>
          
          <div class="p-6">
            <div *ngIf="cargandoCarreras" class="text-center py-8">
              <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              <p class="mt-2 text-gray-600">Cargando carreras...</p>
            </div>

            <div *ngIf="!cargandoCarreras && carreras.length === 0" class="text-center py-8 text-gray-500">
              No hay carreras registradas
            </div>

            <div *ngIf="!cargandoCarreras && carreras.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div *ngFor="let carrera of carreras" class="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div class="flex justify-between items-start mb-3">
                  <div class="flex-1">
                    <h4 class="font-semibold text-gray-800 text-lg">{{ carrera.nombre }}</h4>
                    <p class="text-sm text-gray-600 mt-1">{{ carrera.duracion_anios }} años de duración</p>
                  </div>
                  <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                        [ngClass]="{
                          'bg-green-100 text-green-800': carrera.estado === 'activa',
                          'bg-red-100 text-red-800': carrera.estado === 'inactiva'
                        }">
                    {{ carrera.estado }}
                  </span>
                </div>
                
                <p *ngIf="carrera.descripcion" class="text-sm text-gray-600 mb-4">
                  {{ carrera.descripcion }}
                </p>
                
                <div class="flex justify-end space-x-2">
                  <button 
                    (click)="editarCarrera(carrera)"
                    class="text-blue-600 hover:text-blue-800 transition-colors">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                    </svg>
                  </button>
                  <button 
                    (click)="eliminarCarrera(carrera)"
                    class="text-red-600 hover:text-red-800 transition-colors">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class GestionCarrerasComponent implements OnInit {
  carreras: Carrera[] = [];
  formulario: FormGroup;
  cargandoCarreras = false;
  cargando = false;
  editandoCarrera: Carrera | null = null;

  private carrerasService = inject(CarrerasService);
  private fb = inject(FormBuilder);

  constructor() {
    this.formulario = this.fb.group({
      nombre: ['', [Validators.required]],
      descripcion: [''],
      duracion_anios: [3, [Validators.required]],
      estado: ['activa']
    });
  }

  ngOnInit(): void {
    this.cargarCarreras();
  }

  cargarCarreras(): void {
    this.cargandoCarreras = true;
    this.carrerasService.getCarreras().subscribe({
      next: (carreras) => {
        this.carreras = carreras;
        this.cargandoCarreras = false;
      },
      error: (error) => {
        console.error('Error al cargar carreras:', error);
        this.cargandoCarreras = false;
        Swal.fire('Error', 'No se pudieron cargar las carreras', 'error');
      }
    });
  }

  guardarCarrera(): void {
    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      return;
    }

    this.cargando = true;
    const datosCarrera: CrearCarreraRequest = this.formulario.value;

    const operacion = this.editandoCarrera 
      ? this.carrerasService.actualizarCarrera(this.editandoCarrera.id, datosCarrera)
      : this.carrerasService.crearCarrera(datosCarrera);

    operacion.subscribe({
      next: () => {
        const mensaje = this.editandoCarrera ? 'actualizada' : 'creada';
        Swal.fire('¡Éxito!', `Carrera ${mensaje} correctamente`, 'success');
        this.cargarCarreras();
        this.resetFormulario();
        this.cargando = false;
      },
      error: (error) => {
        console.error('Error al guardar carrera:', error);
        const mensaje = error.error?.error || 'No se pudo guardar la carrera';
        Swal.fire('Error', mensaje, 'error');
        this.cargando = false;
      }
    });
  }

  editarCarrera(carrera: Carrera): void {
    this.editandoCarrera = carrera;
    this.formulario.patchValue({
      nombre: carrera.nombre,
      descripcion: carrera.descripcion || '',
      duracion_anios: carrera.duracion_anios,
      estado: carrera.estado
    });
  }

  cancelarEdicion(): void {
    this.editandoCarrera = null;
    this.resetFormulario();
  }

  eliminarCarrera(carrera: Carrera): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: `¿Deseas eliminar la carrera "${carrera.nombre}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.carrerasService.eliminarCarrera(carrera.id).subscribe({
          next: () => {
            Swal.fire('¡Eliminada!', 'Carrera eliminada correctamente', 'success');
            this.cargarCarreras();
          },
          error: (error) => {
            console.error('Error al eliminar carrera:', error);
            const mensaje = error.error?.error || 'No se pudo eliminar la carrera';
            Swal.fire('Error', mensaje, 'error');
          }
        });
      }
    });
  }

  private resetFormulario(): void {
    this.formulario.reset({
      nombre: '',
      descripcion: '',
      duracion_anios: 3,
      estado: 'activa'
    });
  }
}
