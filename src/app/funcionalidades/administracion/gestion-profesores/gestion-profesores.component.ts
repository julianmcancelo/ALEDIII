/**
 * @file gestion-profesores.component.ts
 * @description Componente para la gestión completa de profesores
 * Permite listar, ver detalles y gestionar profesores del sistema
 * 
 * TP Final Algoritmos y Estructuras de Datos III - 2025
 * Alumnos: CANCELO JULIAN - NICOLAS OTERO (Curso 3ra 1RA)
 * Profesor: Sebastian Saldivar
 */

import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ProfesoresService, Profesor } from '../../../nucleo/servicios/profesores.service';
import { MateriasService, Materia } from '../../../nucleo/servicios/materias.service';

@Component({
  selector: 'app-gestion-profesores',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <!-- CONTENEDOR PRINCIPAL ESTILO ARGON DASHBOARD -->
    <div class="min-h-screen bg-gray-50 p-4">
      <div class="max-w-7xl mx-auto">
        
        <!-- HEADER LIMPIO ESTILO ARGON -->
        <div class="mb-6">
          <div class="flex items-center justify-between">
            <div>
              <h1 class="text-2xl font-bold text-gray-900">Gestión de Profesores</h1>
              <p class="text-gray-600 mt-1">Administra la información de los profesores del instituto</p>
            </div>
            <div class="flex items-center space-x-3">
              <div class="inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-medium bg-green-100 text-green-800">
                <div class="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                {{ profesores.length }} Profesores
              </div>
            </div>
          </div>
        </div>
        
        <!-- TARJETAS DE ESTADÍSTICAS ESTILO ARGON -->
        <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-6" *ngIf="!loading && !error">
          
          <!-- Tarjeta: Total Profesores -->
          <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div class="flex items-center">
              <div class="flex-1">
                <p class="text-sm font-medium text-gray-600 uppercase tracking-wide">TOTAL PROFESORES</p>
                <div class="mt-2">
                  <div class="text-3xl font-bold text-gray-900">{{ profesores.length }}</div>
                </div>
                <div class="mt-2 flex items-center text-sm">
                  <span class="text-green-600 font-medium">↗ 3%</span>
                  <span class="text-gray-500 ml-2">vs mes anterior</span>
                </div>
              </div>
              <div class="ml-4">
                <div class="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
                  <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                  </svg>
                </div>
              </div>
            </div>
          </div>

          <!-- Tarjeta: Con Especialidad -->
          <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div class="flex items-center">
              <div class="flex-1">
                <p class="text-sm font-medium text-gray-600 uppercase tracking-wide">CON ESPECIALIDAD</p>
                <div class="mt-2">
                  <div class="text-3xl font-bold text-gray-900">{{ profesoresConEspecialidad }}</div>
                </div>
                <div class="mt-2 flex items-center text-sm">
                  <span class="text-green-600 font-medium">↗ 2%</span>
                  <span class="text-gray-500 ml-2">especializados</span>
                </div>
              </div>
              <div class="ml-4">
                <div class="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
                  <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
                  </svg>
                </div>
              </div>
            </div>
          </div>

          <!-- Tarjeta: Departamentos -->
          <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div class="flex items-center">
              <div class="flex-1">
                <p class="text-sm font-medium text-gray-600 uppercase tracking-wide">DEPARTAMENTOS</p>
                <div class="mt-2">
                  <div class="text-3xl font-bold text-gray-900">{{ departamentosUnicos }}</div>
                </div>
                <div class="mt-2 flex items-center text-sm">
                  <span class="text-blue-600 font-medium">→ 0%</span>
                  <span class="text-gray-500 ml-2">áreas académicas</span>
                </div>
              </div>
              <div class="ml-4">
                <div class="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center">
                  <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                  </svg>
                </div>
              </div>
            </div>
          </div>

          <!-- Tarjeta: Activos -->
          <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div class="flex items-center">
              <div class="flex-1">
                <p class="text-sm font-medium text-gray-600 uppercase tracking-wide">ACTIVOS</p>
                <div class="mt-2">
                  <div class="text-3xl font-bold text-gray-900">{{ profesores.length }}</div>
                </div>
                <div class="mt-2 flex items-center text-sm">
                  <span class="text-green-600 font-medium">↗ 6%</span>
                  <span class="text-gray-500 ml-2">profesores activos</span>
                </div>
              </div>
              <div class="ml-4">
                <div class="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center">
                  <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>

      <!-- Loading State -->
      <div *ngIf="loading" class="flex justify-center items-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>

        <!-- Error State -->
        <div *ngIf="error" class="bg-red-50 border border-red-200 rounded-2xl p-6 mb-8 shadow-lg">
          <div class="flex">
            <div class="flex-shrink-0">
              <svg class="h-6 w-6 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
              </svg>
            </div>
            <div class="ml-3">
              <h3 class="text-sm font-bold text-red-800">Error</h3>
              <p class="text-sm text-red-700 mt-1">{{ error }}</p>
            </div>
          </div>
        </div>


        <!-- PANEL DE FILTROS ESTILO ARGON -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 mb-6" *ngIf="!loading && !error">
          <div class="px-6 py-4 border-b border-gray-200">
            <div class="flex items-center justify-between">
              <div>
                <h2 class="text-lg font-semibold text-gray-900">Lista de Profesores</h2>
                <p class="text-sm text-gray-600 mt-1">Busca y filtra profesores por especialidad y departamento</p>
              </div>
              <button 
                (click)="navegarARegistro()"
                class="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                </svg>
                Nuevo Profesor
              </button>
            </div>
          </div>
          <div class="p-6">
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Buscar Profesor</label>
                <div class="relative">
                  <input 
                    type="text" 
                    [(ngModel)]="searchTerm"
                    (input)="filtrarProfesores()"
                    placeholder="Buscar por nombre o email..."
                    class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                  <svg class="absolute left-3 top-2.5 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                  </svg>
                </div>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Filtrar por Especialidad</label>
                <select 
                  [(ngModel)]="filtroEspecialidad"
                  (change)="filtrarProfesores()"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                  <option value="">Todas las especialidades</option>
                  <option *ngFor="let esp of especialidadesUnicas" [value]="esp">{{ esp }}</option>
                </select>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Filtrar por Departamento</label>
                <select 
                  [(ngModel)]="filtroDepartamento"
                  (change)="filtrarProfesores()"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                  <option value="">Todos los departamentos</option>
                  <option *ngFor="let dept of departamentosUnicosArray" [value]="dept">{{ dept }}</option>
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
                    Profesor
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contacto
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Especialidad
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Departamento
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Registro
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr *ngFor="let profesor of profesoresFiltrados" class="hover:bg-gray-50">
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex items-center">
                      <div class="flex-shrink-0 h-10 w-10">
                        <div class="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-medium text-sm">
                          {{ getInitials(profesor.name) }}
                        </div>
                      </div>
                      <div class="ml-4">
                        <div class="text-sm font-medium text-gray-900">
                          {{ profesor.name }}
                        </div>
                        <div class="text-sm text-gray-500">
                          ID: {{ profesor.id }}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-900">{{ profesor.email }}</div>
                    <div class="text-sm text-gray-500">{{ profesor.telefono || 'No especificado' }}</div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      {{ profesor.especialidad || 'Sin especialidad' }}
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {{ profesor.departamento || 'Sin departamento' }}
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {{ formatDate(profesor.created_at) }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div class="flex space-x-3">
                      <button 
                        (click)="editarProfesor(profesor)" 
                        class="text-blue-600 hover:text-blue-900">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                        </svg>
                      </button>
                      <button 
                        (click)="eliminarProfesor(profesor.id)" 
                        class="text-red-600 hover:text-red-900">
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

          <!-- Empty State -->
          <div *ngIf="profesoresFiltrados.length === 0" class="text-center py-12">
            <svg class="mx-auto h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <h3 class="mt-4 text-lg font-bold text-gray-900">No hay profesores</h3>
            <p class="mt-2 text-sm text-gray-500">
              {{ searchTerm || filtroEspecialidad || filtroDepartamento ? 'No se encontraron profesores con los filtros aplicados.' : 'No hay profesores registrados en el sistema.' }}
            </p>
          </div>

          <!-- Paginación simple -->
          <div class="flex items-center justify-between mt-6 px-6 pb-6">
            <div class="text-sm text-gray-700">
              Mostrando {{ profesoresFiltrados.length }} de {{ profesores.length }} profesores
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

      <!-- Professor Detail Modal -->
      <div *ngIf="profesorSeleccionado" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
        <div class="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
          <div class="mt-3">
            <!-- Modal Header -->
            <div class="flex items-center justify-between pb-4 border-b">
              <h3 class="text-lg font-semibold text-gray-900">Detalles del Profesor</h3>
              <button
                (click)="cerrarModal()"
                class="text-gray-400 hover:text-gray-600"
              >
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>

            <!-- Modal Content -->
            <div class="py-6">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Nombre completo</label>
                  <p class="text-sm text-gray-900 bg-gray-50 p-2 rounded">{{ profesorSeleccionado.name }}</p>
                </div>
                
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <p class="text-sm text-gray-900 bg-gray-50 p-2 rounded">{{ profesorSeleccionado.email }}</p>
                </div>
                
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Especialidad</label>
                  <p class="text-sm text-gray-900 bg-gray-50 p-2 rounded">
                    {{ profesorSeleccionado.especialidad || 'Sin especialidad definida' }}
                  </p>
                </div>
                
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Departamento</label>
                  <p class="text-sm text-gray-900 bg-gray-50 p-2 rounded">
                    {{ profesorSeleccionado.departamento || 'Sin departamento asignado' }}
                  </p>
                </div>
                
                <div class="md:col-span-2">
                  <label class="block text-sm font-medium text-gray-700 mb-1">Fecha de registro</label>
                  <p class="text-sm text-gray-900 bg-gray-50 p-2 rounded">{{ formatDate(profesorSeleccionado.created_at) }}</p>
                </div>
              </div>

              <!-- Materias del profesor -->
              <div *ngIf="materiasProfesor.length > 0" class="mt-6">
                <h4 class="text-md font-semibold text-gray-900 mb-3">Materias asignadas</h4>
                <div class="space-y-2">
                  <div *ngFor="let materia of materiasProfesor" class="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <div class="flex justify-between items-start">
                      <div>
                        <h5 class="font-medium text-blue-900">{{ materia.nombre }}</h5>
                        <p class="text-sm text-blue-700">{{ materia.carrera_nombre }} - Año {{ materia.anio }}</p>
                        <p class="text-xs text-blue-600">{{ materia.cuatrimestre === 'anual' ? 'Anual' : materia.cuatrimestre + '° Cuatrimestre' }}</p>
                      </div>
                      <span class="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                        {{ materia.horas_semanales }}h/sem
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div *ngIf="materiasProfesor.length === 0 && profesorSeleccionado" class="mt-6">
                <div class="text-center py-4 bg-gray-50 rounded-lg">
                  <p class="text-sm text-gray-500">Este profesor no tiene materias asignadas</p>
                </div>
              </div>
            </div>

            <!-- Modal Footer -->
            <div class="flex justify-end pt-4 border-t">
              <button
                (click)="cerrarModal()"
                class="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .animate-spin {
      animation: spin 1s linear infinite;
    }
    
    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
  `]
})
export class GestionProfesoresComponent implements OnInit {
  private profesoresService = inject(ProfesoresService);
  private materiasService = inject(MateriasService);
  private router = inject(Router);

  // State management
  loading = true;
  error: string | null = null;
  
  // Data
  profesores: Profesor[] = [];
  profesoresFiltrados: Profesor[] = [];
  materiasProfesor: Materia[] = [];
  
  // Filters
  searchTerm = '';
  filtroEspecialidad = '';
  filtroDepartamento = '';
  
  // Modal
  profesorSeleccionado: Profesor | null = null;

  ngOnInit() {
    this.cargarProfesores();
  }

  /**
   * Carga la lista de profesores desde la API
   */
  cargarProfesores() {
    this.loading = true;
    this.error = null;

    this.profesoresService.getProfesores().subscribe({
      next: (profesores) => {
        this.profesores = profesores;
        this.profesoresFiltrados = [...profesores];
        this.loading = false;
      },
      error: (error) => {
        console.error('Error al cargar profesores:', error);
        this.error = 'No se pudieron cargar los profesores. Verifique la conexión con el servidor.';
        this.loading = false;
      }
    });
  }

  /**
   * Filtra la lista de profesores según los criterios seleccionados
   */
  filtrarProfesores() {
    this.profesoresFiltrados = this.profesores.filter(profesor => {
      const matchSearch = !this.searchTerm || 
        profesor.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        profesor.email.toLowerCase().includes(this.searchTerm.toLowerCase());
      
      const matchEspecialidad = !this.filtroEspecialidad || 
        profesor.especialidad === this.filtroEspecialidad;
      
      const matchDepartamento = !this.filtroDepartamento || 
        profesor.departamento === this.filtroDepartamento;

      return matchSearch && matchEspecialidad && matchDepartamento;
    });
  }

  /**
   * Limpia todos los filtros aplicados
   */
  limpiarFiltros() {
    this.searchTerm = '';
    this.filtroEspecialidad = '';
    this.filtroDepartamento = '';
    this.filtrarProfesores();
  }


  /**
   * Obtiene las iniciales del nombre de un profesor
   */
  getInitials(name: string): string {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .substring(0, 2);
  }

  /**
   * Formatea una fecha para mostrar
   */
  formatDate(dateString: string): string {
    if (!dateString) return 'No disponible';
    
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  /**
   * Edita un profesor
   */
  editarProfesor(profesor: Profesor) {
    console.log('Editando profesor:', profesor);
    // TODO: Implementar modal de edición
  }

  /**
   * Elimina un profesor
   */
  eliminarProfesor(profesorId: string | number) {
    if (confirm('¿Está seguro de que desea eliminar este profesor?')) {
      console.log('Eliminando profesor:', profesorId);
      // TODO: Implementar método deleteProfesor en el servicio
      this.error = 'Funcionalidad de eliminación no implementada aún';
    }
  }

  /**
   * Ver detalles del profesor
   */
  verDetalleProfesor(profesor: Profesor) {
    this.profesorSeleccionado = profesor;
    this.cargarMateriasProfesor(profesor.id);
  }

  /**
   * Ver materias del profesor
   */
  verMateriasProfesor(profesor: Profesor) {
    this.verDetalleProfesor(profesor);
  }

  /**
   * Carga las materias de un profesor
   */
  cargarMateriasProfesor(profesorId: string | number) {
    // TODO: Implementar método getMateriasByProfesor en MateriasService
    console.log('Cargando materias para profesor:', profesorId);
    this.materiasProfesor = [];
  }

  /**
   * Cierra el modal
   */
  cerrarModal() {
    this.profesorSeleccionado = null;
    this.materiasProfesor = [];
  }

  // Computed properties para estadísticas
  get profesoresConEspecialidad(): number {
    return this.profesores.filter(p => p.especialidad && p.especialidad.trim() !== '').length;
  }

  get departamentosUnicos(): number {
    const departamentos = new Set(
      this.profesores
        .filter(p => p.departamento && p.departamento.trim() !== '')
        .map(p => p.departamento!)
    );
    return departamentos.size;
  }

  get especialidadesUnicas(): string[] {
    const especialidades = new Set(
      this.profesores
        .filter(p => p.especialidad && p.especialidad.trim() !== '')
        .map(p => p.especialidad!)
    );
    return Array.from(especialidades).sort();
  }

  get departamentosUnicosArray(): string[] {
    const departamentos = new Set(
      this.profesores
        .filter(p => p.departamento && p.departamento.trim() !== '')
        .map(p => p.departamento!)
    );
    return Array.from(departamentos).sort();
  }

  /**
   * Navega al componente de registro de profesor
   * Lint ID: 73c61ce0-8492-4dae-855a-4a3a7ff8f667
   */
  navegarARegistro(): void {
    this.router.navigate(['/dashboard/administracion/profesores/registro']);
  }
}
