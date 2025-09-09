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
    <div class="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6">
      <div class="max-w-7xl mx-auto">
        <!-- Header con gradiente y sombra -->
        <div class="bg-white rounded-2xl shadow-xl mb-8 overflow-hidden">
          <div class="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 px-8 py-6">
            <div class="flex justify-between items-center">
              <div>
                <h1 class="text-3xl font-bold text-white mb-2">Gestión de Estudiantes</h1>
                <p class="text-blue-100">Administra la información de los estudiantes del instituto</p>
              </div>
              <button (click)="abrirModalCrear()" 
                      class="bg-white text-indigo-600 hover:bg-indigo-50 px-6 py-3 rounded-xl flex items-center space-x-2 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                </svg>
                <span class="font-semibold">Nuevo Estudiante</span>
              </button>
            </div>
          </div>
        </div>

      <div class="bg-white rounded-lg shadow-lg">
        <div class="p-6 border-b border-gray-200">
          <h2 class="text-xl font-semibold text-gray-800">Lista de Estudiantes</h2>
        </div>
        
        <div class="p-6">
          <!-- Filtros mejorados -->
        <div class="bg-white rounded-2xl shadow-lg mb-8 overflow-hidden">
          <div class="p-6">
            <h2 class="text-xl font-bold text-gray-800 mb-6 flex items-center">
              <svg class="w-6 h-6 text-indigo-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"></path>
              </svg>
              Lista de Estudiantes
            </h2>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div class="md:col-span-2">
                <label class="block text-sm font-semibold text-gray-700 mb-2">Buscar Estudiante</label>
                <div class="relative">
                  <input 
                    type="text" 
                    [(ngModel)]="terminoBusqueda"
                    (input)="aplicarFiltro()"
                    placeholder="Buscar por nombre, email, DNI, legajo..."
                    class="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 shadow-sm">
                  <svg class="absolute left-4 top-3.5 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                  </svg>
                </div>
              </div>
              
              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-2">Filtrar por Estado</label>
                <select 
                  [(ngModel)]="filtroEstado"
                  (change)="aplicarFiltro()"
                  class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 shadow-sm">
                  <option value="">Todos los estados</option>
                  <option value="activo">Activo</option>
                  <option value="inactivo">Inactivo</option>
                  <option value="graduado">Graduado</option>
                </select>
              </div>
            </div>
          </div>

          <!-- Tabla de estudiantes mejorada -->
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gradient-to-r from-gray-50 to-gray-100">
                <tr>
                  <th class="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Estudiante
                  </th>
                  <th class="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Contacto
                  </th>
                  <th class="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Carrera
                  </th>
                  <th class="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Fechas
                  </th>
                  <th class="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Estado
                  </th>
                  <th class="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr *ngFor="let estudiante of estudiantesFiltrados" class="hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-200">
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex items-center">
                      <div class="flex-shrink-0 h-12 w-12">
                        <div class="h-12 w-12 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold shadow-lg">
                          {{getIniciales(estudiante.name, estudiante.apellidos)}}
                        </div>
                      </div>
                      <div class="ml-4">
                        <div class="text-sm font-bold text-gray-900">
                          {{estudiante.name}} {{estudiante.apellidos}}
                        </div>
                        <div class="text-sm text-gray-500 flex items-center">
                          <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V4a2 2 0 114 0v2m-4 0a2 2 0 104 0m-4 0a2 2 0 014 0"></path>
                          </svg>
                          {{estudiante.legajo || 'Sin legajo'}}
                        </div>
                        <div *ngIf="estudiante.dni" class="text-xs text-gray-400">
                          DNI: {{estudiante.dni}}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-900 flex items-center">
                      <svg class="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                      </svg>
                      {{estudiante.email}}
                    </div>
                    <div *ngIf="estudiante.telefono" class="text-sm text-gray-500 flex items-center mt-1">
                      <svg class="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                      </svg>
                      {{estudiante.telefono}}
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm font-medium text-gray-900">
                      {{estudiante.carrera_nombre || 'Sin carrera'}}
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div *ngIf="estudiante.fechaInscripcion" class="flex items-center">
                      <svg class="w-4 h-4 mr-1 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                      </svg>
                      Inscripción: {{formatearFechaCorta(estudiante.fechaInscripcion)}}
                    </div>
                    <div *ngIf="estudiante.fechaNacimiento" class="flex items-center mt-1">
                      <svg class="w-4 h-4 mr-1 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4.5a2.5 2.5 0 005 0V8"></path>
                      </svg>
                      Nacimiento: {{formatearFechaCorta(estudiante.fechaNacimiento)}}
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span [ngClass]="getClaseEstado(estudiante.estado || 'activo')" 
                          class="inline-flex px-3 py-1 text-xs font-bold rounded-full shadow-sm">
                      {{getEtiquetaEstado(estudiante.estado || 'activo')}}
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div class="flex space-x-2">
                      <button (click)="editarEstudiante(estudiante)"
                              class="text-indigo-600 hover:text-indigo-900 p-2 rounded-lg hover:bg-indigo-50 transition-all duration-200"
                              title="Editar estudiante">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                        </svg>
                      </button>
                      <button (click)="eliminarEstudiante(estudiante)"
                              class="text-red-600 hover:text-red-900 p-2 rounded-lg hover:bg-red-50 transition-all duration-200"
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

          <!-- Paginación simple -->
          <div class="flex items-center justify-between mt-6">
            <div class="text-sm text-gray-700">
              Mostrando {{estudiantesFiltrados.length}} de {{estudiantes.length}} estudiantes
            </div>
            <div class="flex space-x-2">
              <button class="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50">
                Anterior
              </button>
              <button class="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50">
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
