import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { StudentService } from '../../../nucleo/servicios/student.service';
import { Estudiante } from '../../../nucleo/modelos/student.model';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-student-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="p-6">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold text-gray-900">Gestión de Estudiantes</h1>
        <button (click)="abrirFormularioEstudiante()" 
                class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
          </svg>
          <span>Nuevo Estudiante</span>
        </button>
      </div>

      <div class="bg-white rounded-lg shadow-lg">
        <div class="p-6 border-b border-gray-200">
          <h2 class="text-xl font-semibold text-gray-800">Lista de Estudiantes</h2>
        </div>
        
        <div class="p-6">
          <!-- Filtros -->
          <div class="flex gap-4 mb-6">
            <div class="flex-1">
              <label class="block text-sm font-medium text-gray-700 mb-2">Buscar</label>
              <div class="relative">
                <input 
                  type="text" 
                  [(ngModel)]="terminoBusqueda"
                  (input)="aplicarFiltro()"
                  placeholder="Nombre, email, carrera..."
                  class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                <svg class="absolute left-3 top-2.5 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                </svg>
              </div>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Estado</label>
              <select 
                [(ngModel)]="filtroEstado"
                (change)="aplicarFiltro()"
                class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                <option value="">Todos</option>
                <option value="activo">Activo</option>
                <option value="inactivo">Inactivo</option>
                <option value="graduado">Graduado</option>
              </select>
            </div>
          </div>

          <!-- Tabla de estudiantes -->
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estudiante
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Carrera
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
                        <div class="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold">
                          {{getIniciales(estudiante.nombres, estudiante.apellidos)}}
                        </div>
                      </div>
                      <div class="ml-4">
                        <div class="text-sm font-medium text-gray-900">
                          {{estudiante.nombres}} {{estudiante.apellidos}}
                        </div>
                        <div class="text-sm text-gray-500">
                          Legajo: {{estudiante.legajo}}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {{estudiante.email}}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {{estudiante.carrera}}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span [ngClass]="getClaseEstado(estudiante.estado)" 
                          class="inline-flex px-2 py-1 text-xs font-semibold rounded-full">
                      {{getEtiquetaEstado(estudiante.estado)}}
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div class="flex space-x-2">
                      <button (click)="editarEstudiante(estudiante)"
                              class="text-blue-600 hover:text-blue-900 p-1 rounded">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                        </svg>
                      </button>
                      <button (click)="eliminarEstudiante(estudiante)"
                              class="text-red-600 hover:text-red-900 p-1 rounded">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
  `
})
export class StudentListComponent implements OnInit {
  estudiantes: Estudiante[] = [];
  estudiantesFiltrados: Estudiante[] = [];
  terminoBusqueda = '';
  filtroEstado = '';

  private studentService = inject(StudentService);
  private router = inject(Router);

  ngOnInit(): void {
    this.cargarEstudiantes();
  }

  cargarEstudiantes(): void {
    this.studentService.getEstudiantes().subscribe(estudiantes => {
      this.estudiantes = estudiantes;
      this.estudiantesFiltrados = estudiantes;
    });
  }

  aplicarFiltro(): void {
    this.estudiantesFiltrados = this.estudiantes.filter(estudiante => {
      const busqueda = this.terminoBusqueda.toLowerCase();
      const coincideBusqueda = !this.terminoBusqueda || 
        estudiante.nombres.toLowerCase().includes(busqueda) ||
        estudiante.apellidos.toLowerCase().includes(busqueda) ||
        estudiante.email.toLowerCase().includes(busqueda) ||
        estudiante.carrera.toLowerCase().includes(busqueda);
      
      const coincideEstado = !this.filtroEstado || estudiante.estado === this.filtroEstado;
      
      return coincideBusqueda && coincideEstado;
    });
  }

  abrirFormularioEstudiante(): void {
    this.router.navigate(['/estudiantes', 'nuevo']);
  }

  editarEstudiante(estudiante: Estudiante): void {
    this.router.navigate(['/estudiantes', 'editar', estudiante.id]);
  }

  eliminarEstudiante(estudiante: Estudiante): void {
    if (confirm(`¿Está seguro de que desea eliminar al estudiante ${estudiante.nombres} ${estudiante.apellidos}?`)) {
      this.studentService.eliminarEstudiante(estudiante.id!).subscribe(() => {
        this.cargarEstudiantes();
      });
    }
  }

  getIniciales(nombres: string, apellidos: string): string {
    return `${nombres.charAt(0)}${apellidos.charAt(0)}`.toUpperCase();
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
}
