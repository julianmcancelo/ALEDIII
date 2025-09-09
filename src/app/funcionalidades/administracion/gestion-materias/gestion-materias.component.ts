import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MateriasService, Materia, CrearMateriaRequest } from '../../../nucleo/servicios/materias.service';
import { CarrerasService, Carrera } from '../../../nucleo/servicios/carreras.service';
import { ProfesoresService, Profesor } from '../../../nucleo/servicios/profesores.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-gestion-materias',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  template: `
    <div class="p-6">
      <div class="max-w-6xl mx-auto">
        <!-- Header -->
        <div class="bg-white rounded-lg shadow-lg mb-6">
          <div class="px-6 py-4 border-b border-gray-200">
            <h2 class="text-2xl font-bold text-gray-800">Gestión de Materias</h2>
            <p class="text-gray-600 mt-1">Administrar materias por carrera y año</p>
          </div>
        </div>

        <!-- Filtros -->
        <div class="bg-white rounded-lg shadow-lg mb-6">
          <div class="px-6 py-4 border-b border-gray-200">
            <h3 class="text-lg font-semibold text-gray-800">Filtros</h3>
          </div>
          <div class="p-6">
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Carrera</label>
                <select 
                  [(ngModel)]="filtroCarrera"
                  (ngModelChange)="aplicarFiltros()"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  <option value="">Todas las carreras</option>
                  <option *ngFor="let carrera of carreras" [value]="carrera.id">
                    {{ carrera.nombre }}
                  </option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Año</label>
                <select 
                  [(ngModel)]="filtroAnio"
                  (ngModelChange)="aplicarFiltros()"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  <option value="">Todos los años</option>
                  <option value="1">1er Año</option>
                  <option value="2">2do Año</option>
                  <option value="3">3er Año</option>
                  <option value="4">4to Año</option>
                  <option value="5">5to Año</option>
                  <option value="6">6to Año</option>
                </select>
              </div>
              <div class="flex items-end">
                <button 
                  (click)="limpiarFiltros()"
                  class="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                  Limpiar Filtros
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Formulario para crear/editar materia -->
        <div class="bg-white rounded-lg shadow-lg mb-6">
          <div class="px-6 py-4 border-b border-gray-200">
            <h3 class="text-lg font-semibold text-gray-800">
              {{ editandoMateria ? 'Editar Materia' : 'Nueva Materia' }}
            </h3>
          </div>
          
          <div class="p-6">
            <form [formGroup]="formulario" (ngSubmit)="guardarMateria()" class="space-y-4">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Nombre de la Materia *</label>
                  <input 
                    type="text" 
                    formControlName="nombre" 
                    placeholder="Programación I"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    [class.border-red-500]="formulario.get('nombre')?.invalid && formulario.get('nombre')?.touched">
                  <div *ngIf="formulario.get('nombre')?.hasError('required') && formulario.get('nombre')?.touched" 
                       class="mt-1 text-sm text-red-600">
                    El nombre es requerido
                  </div>
                </div>
                
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Código *</label>
                  <input 
                    type="text" 
                    formControlName="codigo" 
                    placeholder="PROG-101"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    [class.border-red-500]="formulario.get('codigo')?.invalid && formulario.get('codigo')?.touched">
                  <div *ngIf="formulario.get('codigo')?.hasError('required') && formulario.get('codigo')?.touched" 
                       class="mt-1 text-sm text-red-600">
                    El código es requerido
                  </div>
                </div>
              </div>
              
              <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Carrera *</label>
                  <select 
                    formControlName="carrera_id"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    [class.border-red-500]="formulario.get('carrera_id')?.invalid && formulario.get('carrera_id')?.touched">
                    <option value="">Seleccionar carrera</option>
                    <option *ngFor="let carrera of carreras" [value]="carrera.id">
                      {{ carrera.nombre }}
                    </option>
                  </select>
                  <div *ngIf="formulario.get('carrera_id')?.hasError('required') && formulario.get('carrera_id')?.touched" 
                       class="mt-1 text-sm text-red-600">
                    La carrera es requerida
                  </div>
                </div>
                
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Profesor</label>
                  <select 
                    formControlName="profesor_id"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    <option value="">Sin profesor asignado</option>
                    <option *ngFor="let profesor of profesores" [value]="profesor.id">
                      {{ profesor.name }} - {{ profesor.especialidad || 'Sin especialidad' }}
                    </option>
                  </select>
                </div>
                
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Año *</label>
                  <select 
                    formControlName="anio"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    <option value="1">1er Año</option>
                    <option value="2">2do Año</option>
                    <option value="3">3er Año</option>
                    <option value="4">4to Año</option>
                    <option value="5">5to Año</option>
                    <option value="6">6to Año</option>
                  </select>
                </div>
                
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Cuatrimestre</label>
                  <select 
                    formControlName="cuatrimestre"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    <option value="anual">Anual</option>
                    <option value="1">1er Cuatrimestre</option>
                    <option value="2">2do Cuatrimestre</option>
                  </select>
                </div>
              </div>
              
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Horas Semanales</label>
                  <input 
                    type="number" 
                    formControlName="horas_semanales" 
                    min="1" 
                    max="20"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
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
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Descripción</label>
                <textarea 
                  formControlName="descripcion" 
                  rows="3"
                  placeholder="Descripción de la materia..."
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                </textarea>
              </div>
              
              <div class="flex justify-end space-x-3">
                <button 
                  *ngIf="editandoMateria"
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
                  {{ editandoMateria ? 'Actualizar' : 'Crear' }} Materia
                </button>
              </div>
            </form>
          </div>
        </div>

        <!-- Lista de materias -->
        <div class="bg-white rounded-lg shadow-lg">
          <div class="px-6 py-4 border-b border-gray-200">
            <h3 class="text-lg font-semibold text-gray-800">
              Materias Registradas 
              <span class="text-sm text-gray-500">({{ materiasFiltradas.length }} materias)</span>
            </h3>
          </div>
          
          <div class="p-6">
            <div *ngIf="cargandoMaterias" class="text-center py-8">
              <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              <p class="mt-2 text-gray-600">Cargando materias...</p>
            </div>

            <div *ngIf="!cargandoMaterias && materiasFiltradas.length === 0" class="text-center py-8 text-gray-500">
              No hay materias registradas
            </div>

            <div *ngIf="!cargandoMaterias && materiasFiltradas.length > 0" class="space-y-4">
              <div *ngFor="let materia of materiasFiltradas" class="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div class="flex justify-between items-start">
                  <div class="flex-1">
                    <div class="flex items-center space-x-3 mb-2">
                      <h4 class="font-semibold text-gray-800 text-lg">{{ materia.nombre }}</h4>
                      <span class="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">{{ materia.codigo }}</span>
                      <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                            [ngClass]="{
                              'bg-green-100 text-green-800': materia.estado === 'activa',
                              'bg-red-100 text-red-800': materia.estado === 'inactiva'
                            }">
                        {{ materia.estado }}
                      </span>
                    </div>
                    
                    <div class="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm text-gray-600 mb-2">
                      <div>
                        <span class="font-medium">Carrera:</span>
                        <span class="block">{{ materia.carrera_nombre }}</span>
                      </div>
                      <div>
                        <span class="font-medium">Año:</span>
                        <span class="block">{{ materia.anio }}° Año</span>
                      </div>
                      <div>
                        <span class="font-medium">Cuatrimestre:</span>
                        <span class="block">{{ getCuatrimestreLabel(materia.cuatrimestre) }}</span>
                      </div>
                      <div>
                        <span class="font-medium">Horas:</span>
                        <span class="block">{{ materia.horas_semanales }}hs/semana</span>
                      </div>
                      <div>
                        <span class="font-medium">Profesor:</span>
                        <span class="block" [ngClass]="{'text-gray-400': !materia.profesor_nombre}">
                          {{ materia.profesor_nombre || 'Sin asignar' }}
                        </span>
                      </div>
                    </div>
                    
                    <p *ngIf="materia.descripcion" class="text-sm text-gray-600">
                      {{ materia.descripcion }}
                    </p>
                  </div>
                  
                  <div class="flex space-x-2 ml-4">
                    <button 
                      (click)="editarMateria(materia)"
                      class="text-blue-600 hover:text-blue-800 transition-colors">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                      </svg>
                    </button>
                    <button 
                      (click)="eliminarMateria(materia)"
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
    </div>
  `
})
export class GestionMateriasComponent implements OnInit {
  materias: Materia[] = [];
  materiasFiltradas: Materia[] = [];
  carreras: Carrera[] = [];
  profesores: Profesor[] = [];
  formulario: FormGroup;
  cargandoMaterias = false;
  cargando = false;
  editandoMateria: Materia | null = null;
  
  filtroCarrera = '';
  filtroAnio = '';

  private materiasService = inject(MateriasService);
  private carrerasService = inject(CarrerasService);
  private profesoresService = inject(ProfesoresService);
  private fb = inject(FormBuilder);

  constructor() {
    this.formulario = this.fb.group({
      nombre: ['', [Validators.required]],
      codigo: ['', [Validators.required]],
      descripcion: [''],
      carrera_id: ['', [Validators.required]],
      profesor_id: [''],
      anio: [1, [Validators.required]],
      cuatrimestre: ['anual'],
      horas_semanales: [4],
      estado: ['activa']
    });
  }

  ngOnInit(): void {
    this.cargarCarreras();
    this.cargarProfesores();
    this.cargarMaterias();
  }

  cargarCarreras(): void {
    this.carrerasService.getCarreras().subscribe({
      next: (carreras) => {
        this.carreras = carreras;
      },
      error: (error) => {
        console.error('Error al cargar carreras:', error);
      }
    });
  }

  cargarProfesores(): void {
    this.profesoresService.getProfesores().subscribe({
      next: (profesores) => {
        this.profesores = profesores;
      },
      error: (error) => {
        console.error('Error al cargar profesores:', error);
      }
    });
  }

  cargarMaterias(): void {
    this.cargandoMaterias = true;
    this.materiasService.getMaterias().subscribe({
      next: (materias) => {
        this.materias = materias;
        this.aplicarFiltros();
        this.cargandoMaterias = false;
      },
      error: (error) => {
        console.error('Error al cargar materias:', error);
        this.cargandoMaterias = false;
        Swal.fire('Error', 'No se pudieron cargar las materias', 'error');
      }
    });
  }

  aplicarFiltros(): void {
    this.materiasFiltradas = this.materias.filter(materia => {
      const cumpleCarrera = !this.filtroCarrera || materia.carrera_id === this.filtroCarrera;
      const cumpleAnio = !this.filtroAnio || materia.anio.toString() === this.filtroAnio;
      return cumpleCarrera && cumpleAnio;
    });
  }

  limpiarFiltros(): void {
    this.filtroCarrera = '';
    this.filtroAnio = '';
    this.aplicarFiltros();
  }

  guardarMateria(): void {
    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      return;
    }

    this.cargando = true;
    const datosMateria: CrearMateriaRequest = this.formulario.value;

    const operacion = this.editandoMateria 
      ? this.materiasService.actualizarMateria(this.editandoMateria.id, datosMateria)
      : this.materiasService.crearMateria(datosMateria);

    operacion.subscribe({
      next: () => {
        const mensaje = this.editandoMateria ? 'actualizada' : 'creada';
        Swal.fire('¡Éxito!', `Materia ${mensaje} correctamente`, 'success');
        this.cargarMaterias();
        this.resetFormulario();
        this.cargando = false;
      },
      error: (error) => {
        console.error('Error al guardar materia:', error);
        const mensaje = error.error?.error || 'No se pudo guardar la materia';
        Swal.fire('Error', mensaje, 'error');
        this.cargando = false;
      }
    });
  }

  editarMateria(materia: Materia): void {
    this.editandoMateria = materia;
    this.formulario.patchValue({
      nombre: materia.nombre,
      codigo: materia.codigo,
      descripcion: materia.descripcion,
      carrera_id: materia.carrera_id,
      profesor_id: materia.profesor_id || '',
      anio: materia.anio,
      cuatrimestre: materia.cuatrimestre,
      horas_semanales: materia.horas_semanales,
      estado: materia.estado
    });
  }

  cancelarEdicion(): void {
    this.editandoMateria = null;
    this.resetFormulario();
  }

  eliminarMateria(materia: Materia): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: `¿Deseas eliminar la materia "${materia.nombre}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.materiasService.eliminarMateria(materia.id).subscribe({
          next: () => {
            Swal.fire('¡Eliminada!', 'Materia eliminada correctamente', 'success');
            this.cargarMaterias();
          },
          error: (error) => {
            console.error('Error al eliminar materia:', error);
            const mensaje = error.error?.error || 'No se pudo eliminar la materia';
            Swal.fire('Error', mensaje, 'error');
          }
        });
      }
    });
  }

  getCuatrimestreLabel(cuatrimestre: string): string {
    const labels = {
      'anual': 'Anual',
      '1': '1er Cuatrimestre',
      '2': '2do Cuatrimestre'
    };
    return labels[cuatrimestre as keyof typeof labels] || cuatrimestre;
  }

  private resetFormulario(): void {
    this.formulario.reset({
      nombre: '',
      codigo: '',
      descripcion: '',
      carrera_id: '',
      profesor_id: '',
      anio: 1,
      cuatrimestre: 'anual',
      horas_semanales: 4,
      estado: 'activa'
    });
  }
}
