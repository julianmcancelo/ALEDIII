import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { UserService, Usuario } from '../../../nucleo/servicios/user.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ModalEstudianteComponent } from '../modales/modal-estudiante/modal-estudiante.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-student-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, ModalEstudianteComponent],
  template: `
    <!-- CONTENEDOR PRINCIPAL ESTILO ARGON DASHBOARD -->
    <div class="min-h-screen bg-gray-50 p-4">
      <div class="max-w-7xl mx-auto">
        
        <!-- HEADER LIMPIO ESTILO ARGON -->
        <div class="mb-6">
          <div class="flex items-center justify-between">
            <div>
              <h1 class="text-2xl font-bold text-gray-900">Gestión de Estudiantes</h1>
              <p class="text-gray-600 mt-1">Administra la información de los estudiantes del instituto</p>
            </div>
            <div class="flex items-center space-x-3">
              <button (click)="abrirModalCrear()" 
                      class="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg">
                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                </svg>
                Nuevo Estudiante
              </button>
            </div>
          </div>
        </div>

        <!-- PANEL DE FILTROS ESTILO ARGON -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
          <div class="px-6 py-4 border-b border-gray-200">
            <h2 class="text-lg font-semibold text-gray-900">Lista de Estudiantes</h2>
            <p class="text-sm text-gray-600 mt-1">Busca y filtra estudiantes registrados en el sistema</p>
          </div>
          <div class="p-6">
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div class="md:col-span-2">
                <label class="block text-sm font-medium text-gray-700 mb-2">Buscar Estudiante</label>
                <div class="relative">
                  <input 
                    type="text" 
                    [(ngModel)]="terminoBusqueda"
                    (input)="aplicarFiltro()"
                    placeholder="Buscar por nombre, email, DNI, legajo..."
                    class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                  <svg class="absolute left-3 top-2.5 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                  </svg>
                </div>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Filtrar por Estado</label>
                <select 
                  [(ngModel)]="filtroEstado"
                  (change)="aplicarFiltro()"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                  <option value="">Todos los estados</option>
                  <option value="activo">Activo</option>
                  <option value="inactivo">Inactivo</option>
                  <option value="graduado">Graduado</option>
                </select>
              </div>
            </div>
            
            <div class="flex justify-end">
              <button 
                (click)="limpiarFiltros()" 
                class="flex items-center px-4 py-2 border border-gray-200 rounded-lg">
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                </svg>
                Limpiar Filtros
              </button>
            </div>
          </div>

          <!-- TABLA ESTILO ARGON -->
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estudiante
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contacto
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Carrera
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fechas
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr *ngFor="let estudiante of estudiantesFiltrados" class="hover:bg-gray-50">
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex items-center">
                      <div class="flex-shrink-0 h-10 w-10">
                        <div class="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-medium">
                          {{getIniciales(estudiante.name, estudiante.apellidos)}}
                        </div>
                      </div>
                      <div class="ml-4">
                        <div class="text-sm font-medium text-gray-900">
                          {{estudiante.name}} {{estudiante.apellidos}}
                        </div>
                        <div class="text-sm text-gray-500">
                          {{estudiante.legajo || 'Sin legajo'}}
                        </div>
                        <div *ngIf="estudiante.dni" class="text-xs text-gray-400">
                          DNI: {{estudiante.dni}}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-900">
                      {{estudiante.email}}
                    </div>
                    <div *ngIf="estudiante.telefono" class="text-sm text-gray-500 mt-1">
                      {{estudiante.telefono}}
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm font-medium text-gray-900">
                      {{estudiante.carrera_nombre || 'Sin carrera'}}
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div *ngIf="estudiante.fechaInscripcion">
                      Inscripción: {{formatearFechaCorta(estudiante.fechaInscripcion)}}
                    </div>
                    <div *ngIf="estudiante.fechaNacimiento" class="mt-1">
                      Nacimiento: {{formatearFechaCorta(estudiante.fechaNacimiento)}}
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span [ngClass]="getClaseEstado(estudiante.estado || 'activo')" 
                          class="inline-flex px-2 py-1 text-xs font-semibold rounded-full">
                      {{getEtiquetaEstado(estudiante.estado || 'activo')}}
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div class="flex space-x-2">
                      <button (click)="editarEstudiante(estudiante)"
                              class="text-indigo-600 hover:text-indigo-900"
                              title="Editar estudiante">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                        </svg>
                      </button>
                      <button (click)="eliminarEstudiante(estudiante)"
                              class="text-red-600 hover:text-red-900"
                              title="Eliminar estudiante">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- PAGINACIÓN ESTILO ARGON -->
          <div class="flex items-center justify-between px-6 py-3 bg-gray-50 border-t border-gray-200">
            <div class="text-sm text-gray-700">
              Mostrando {{estudiantesFiltrados.length}} de {{estudiantes.length}} estudiantes
            </div>
            <div class="flex space-x-2">
              <button class="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 text-gray-700">
                Anterior
              </button>
              <button class="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 text-gray-700">
                Siguiente
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de Estudiante -->
    <app-modal-estudiante 
      [mostrar]="mostrarModal"
      [estudiante]="estudianteSeleccionado"
      (cerrado)="cerrarModal()"
      (estudianteGuardado)="onEstudianteGuardado()">
    </app-modal-estudiante>
  `
})
export class StudentListComponent implements OnInit {
  estudiantes: Usuario[] = [];
  estudiantesFiltrados: Usuario[] = [];
  terminoBusqueda = '';
  filtroEstado = '';
  mostrarModal = false;
  estudianteSeleccionado: Usuario | null = null;

  private userService = inject(UserService);
  private router = inject(Router);

  ngOnInit(): void {
    this.cargarEstudiantes();
  }

  cargarEstudiantes(): void {
    this.userService.getUsuarios().subscribe({
      next: (usuarios: Usuario[]) => {
        // Filtrar solo estudiantes
        this.estudiantes = usuarios.filter((user: Usuario) => user.role === 'student');
        this.estudiantesFiltrados = this.estudiantes;
      },
      error: (error: any) => {
        console.error('Error al cargar estudiantes:', error);
        Swal.fire('Error', 'No se pudieron cargar los estudiantes', 'error');
      }
    });
  }

  aplicarFiltro(): void {
    this.estudiantesFiltrados = this.estudiantes.filter(estudiante => {
      const busqueda = this.terminoBusqueda.toLowerCase();
      const coincideBusqueda = !this.terminoBusqueda || 
        estudiante.name.toLowerCase().includes(busqueda) ||
        (estudiante.apellidos || '').toLowerCase().includes(busqueda) ||
        estudiante.email.toLowerCase().includes(busqueda) ||
        (estudiante.carrera_nombre || '').toLowerCase().includes(busqueda) ||
        (estudiante.dni || '').toLowerCase().includes(busqueda) ||
        (estudiante.legajo || '').toLowerCase().includes(busqueda);
      
      const coincideEstado = !this.filtroEstado || estudiante.estado === this.filtroEstado;
      
      return coincideBusqueda && coincideEstado;
    });
  }

  limpiarFiltros(): void {
    this.terminoBusqueda = '';
    this.filtroEstado = '';
    this.aplicarFiltro();
  }


  eliminarEstudiante(estudiante: Usuario): void {
    Swal.fire({
      title: '¿Está seguro?',
      text: `¿Desea eliminar al estudiante ${estudiante.name} ${estudiante.apellidos || ''}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.userService.eliminarUsuario(estudiante.id!).subscribe({
          next: () => {
            this.cargarEstudiantes();
            Swal.fire('Eliminado', 'El estudiante ha sido eliminado', 'success');
          },
          error: (error: any) => {
            console.error('Error al eliminar estudiante:', error);
            Swal.fire('Error', 'No se pudo eliminar el estudiante', 'error');
          }
        });
      }
    });
  }

  getIniciales(nombres: string, apellidos?: string): string {
    const inicial1 = nombres.charAt(0);
    const inicial2 = apellidos ? apellidos.charAt(0) : '';
    return `${inicial1}${inicial2}`.toUpperCase();
  }

  getClaseEstado(estado: string): string {
    const classes = {
      'activo': 'bg-green-100 text-green-800',
      'inactivo': 'bg-red-100 text-red-800',
      'graduado': 'bg-blue-100 text-blue-800'
    };
    return classes[estado as keyof typeof classes] || 'bg-gray-100 text-gray-800';
  }

  getEtiquetaEstado(estado: string): string {
    const labels = {
      'activo': 'Activo',
      'inactivo': 'Inactivo',
      'graduado': 'Graduado'
    };
    return labels[estado as keyof typeof labels] || estado;
  }

  abrirModalCrear(): void {
    this.estudianteSeleccionado = null;
    this.mostrarModal = true;
  }

  editarEstudiante(estudiante: Usuario): void {
    this.estudianteSeleccionado = estudiante;
    this.mostrarModal = true;
  }

  cerrarModal(): void {
    this.mostrarModal = false;
    this.estudianteSeleccionado = null;
  }

  onEstudianteGuardado(): void {
    this.cargarEstudiantes();
  }

  formatearFechaCorta(fecha: string | Date): string {
    if (!fecha) return '';
    const d = new Date(fecha);
    const dia = ('0' + d.getDate()).slice(-2);
    const mes = ('0' + (d.getMonth() + 1)).slice(-2);
    const anio = d.getFullYear().toString().slice(-2);
    return `${dia}/${mes}/${anio}`;
  }
}
