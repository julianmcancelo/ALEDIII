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
    <!-- CONTENEDOR PRINCIPAL ESTILO ARGON DASHBOARD -->
    <div class="min-h-screen bg-gray-50 p-4">
      <div class="max-w-7xl mx-auto">
        
        <!-- HEADER LIMPIO ESTILO ARGON -->
        <div class="mb-6">
          <div class="flex items-center justify-between">
            <div>
              <h1 class="text-2xl font-bold text-gray-900">Gestión de Materias</h1>
              <p class="text-gray-600 mt-1">Administra el plan de estudios y asignaciones académicas del instituto</p>
            </div>
            <div class="flex items-center space-x-3">
              <div class="inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-medium bg-blue-100 text-blue-800">
                <div class="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                {{ materias.length }} Materias
              </div>
            </div>
          </div>
        </div>

        <!-- TARJETAS DE ESTADÍSTICAS ESTILO ARGON -->
        <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-6">
          
          <!-- Tarjeta: Total Materias -->
          <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div class="flex items-center">
              <div class="flex-1">
                <p class="text-sm font-medium text-gray-600 uppercase tracking-wide">TOTAL MATERIAS</p>
                <div class="mt-2">
                  <div class="text-3xl font-bold text-gray-900">{{ materias.length }}</div>
                </div>
                <div class="mt-2 flex items-center text-sm">
                  <span class="text-green-600 font-medium">↗ 3%</span>
                  <span class="text-gray-500 ml-2">vs mes anterior</span>
                </div>
              </div>
              <div class="ml-4">
                <div class="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
                  <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
                  </svg>
                </div>
              </div>
            </div>
          </div>

          <!-- Tarjeta: Materias Activas -->
          <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div class="flex items-center">
              <div class="flex-1">
                <p class="text-sm font-medium text-gray-600 uppercase tracking-wide">MATERIAS ACTIVAS</p>
                <div class="mt-2">
                  <div class="text-3xl font-bold text-gray-900">{{ getMateriasActivas() }}</div>
                </div>
                <div class="mt-2 flex items-center text-sm">
                  <span class="text-green-600 font-medium">↗ 2%</span>
                  <span class="text-gray-500 ml-2">materias en curso</span>
                </div>
              </div>
              <div class="ml-4">
                <div class="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
                  <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </div>
              </div>
            </div>
          </div>

          <!-- Tarjeta: Materias Inactivas -->
          <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div class="flex items-center">
              <div class="flex-1">
                <p class="text-sm font-medium text-gray-600 uppercase tracking-wide">MATERIAS INACTIVAS</p>
                <div class="mt-2">
                  <div class="text-3xl font-bold text-gray-900">{{ materias.length - getMateriasActivas() }}</div>
                </div>
                <div class="mt-2 flex items-center text-sm">
                  <span class="text-red-600 font-medium">↘ 1%</span>
                  <span class="text-gray-500 ml-2">materias pausadas</span>
                </div>
              </div>
              <div class="ml-4">
                <div class="w-12 h-12 bg-red-500 rounded-lg flex items-center justify-center">
                  <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </div>
              </div>
            </div>
          </div>

          <!-- Tarjeta: Con Profesor -->
          <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div class="flex items-center">
              <div class="flex-1">
                <p class="text-sm font-medium text-gray-600 uppercase tracking-wide">CON PROFESOR</p>
                <div class="mt-2">
                  <div class="text-3xl font-bold text-gray-900">{{ getMateriasConProfesor() }}</div>
                </div>
                <div class="mt-2 flex items-center text-sm">
                  <span class="text-blue-600 font-medium">→ 0%</span>
                  <span class="text-gray-500 ml-2">materias asignadas</span>
                </div>
              </div>
              <div class="ml-4">
                <div class="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center">
                  <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- PANEL DE FILTROS ESTILO ARGON -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
          <div class="px-6 py-4 border-b border-gray-200">
            <h2 class="text-lg font-semibold text-gray-900">Filtros de Búsqueda</h2>
            <p class="text-sm text-gray-600 mt-1">Busca y filtra materias por carrera, año y texto</p>
          </div>
          <div class="p-6">
            <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Carrera</label>
                <select 
                  [(ngModel)]="filtroCarrera"
                  (ngModelChange)="aplicarFiltros()"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
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
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                  <option value="">Todos los años</option>
                  <option value="1">1er Año</option>
                  <option value="2">2do Año</option>
                  <option value="3">3er Año</option>
                  <option value="4">4to Año</option>
                  <option value="5">5to Año</option>
                  <option value="6">6to Año</option>
                </select>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Búsqueda Rápida</label>
                <div class="relative">
                  <input 
                    type="text" 
                    [(ngModel)]="busquedaTexto"
                    (ngModelChange)="aplicarFiltros()"
                    placeholder="Buscar por nombre o código..."
                    class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                  <svg class="absolute left-3 top-2.5 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                  </svg>
                </div>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">&nbsp;</label>
                <button 
                  (click)="limpiarFiltros()"
                  class="w-full flex items-center justify-center px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50">
                  <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                  </svg>
                  Limpiar Filtros
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- FORMULARIO ESTILO ARGON -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 mb-6" [ngClass]="{'ring-2 ring-blue-500': mostrarFormulario}">
          <div class="px-6 py-4 border-b border-gray-200 cursor-pointer" (click)="toggleFormulario()">
            <div class="flex justify-between items-center">
              <h3 class="text-lg font-semibold text-gray-900 flex items-center">
                <svg class="w-5 h-5 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                </svg>
                {{ editandoMateria ? 'Editar Materia' : 'Nueva Materia' }}
              </h3>
              <button type="button" class="text-gray-400 hover:text-gray-600">
                <svg class="w-5 h-5 transform transition-transform duration-200" [ngClass]="{'rotate-45': mostrarFormulario}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                </svg>
              </button>
            </div>
          </div>
          <div class="p-6" *ngIf="mostrarFormulario">
            <form [formGroup]="formulario" (ngSubmit)="guardarMateria()" class="wp-form">
              <div class="wp-form-row">
                <div class="wp-form-group">
                  <label class="wp-label">Nombre de la Materia *</label>
                  <input 
                    type="text" 
                    formControlName="nombre" 
                    placeholder="Programación I"
                    class="wp-input"
                    [class.wp-input-error]="formulario.get('nombre')?.invalid && formulario.get('nombre')?.touched">
                  <div *ngIf="formulario.get('nombre')?.hasError('required') && formulario.get('nombre')?.touched" 
                       class="wp-error-message">
                    El nombre es requerido
                  </div>
                </div>
                
                <div class="wp-form-group">
                  <label class="wp-label">Código *</label>
                  <input 
                    type="text" 
                    formControlName="codigo" 
                    placeholder="PROG-101"
                    class="wp-input"
                    [class.wp-input-error]="formulario.get('codigo')?.invalid && formulario.get('codigo')?.touched">
                  <div *ngIf="formulario.get('codigo')?.hasError('required') && formulario.get('codigo')?.touched" 
                       class="wp-error-message">
                    El código es requerido
                  </div>
                </div>
              </div>
              
              <div class="wp-form-row wp-form-row-3">
                <div class="wp-form-group">
                  <label class="wp-label">Carrera *</label>
                  <select 
                    formControlName="carrera_id"
                    class="wp-select"
                    [class.wp-input-error]="formulario.get('carrera_id')?.invalid && formulario.get('carrera_id')?.touched">
                    <option value="">Seleccionar carrera</option>
                    <option *ngFor="let carrera of carreras" [value]="carrera.id">
                      {{ carrera.nombre }}
                    </option>
                  </select>
                  <div *ngIf="formulario.get('carrera_id')?.hasError('required') && formulario.get('carrera_id')?.touched" 
                       class="wp-error-message">
                    La carrera es requerida
                  </div>
                </div>
                
                <div class="wp-form-group">
                  <label class="wp-label">Profesor</label>
                  <select 
                    formControlName="profesor_id"
                    class="wp-select">
                    <option value="">Sin profesor asignado</option>
                    <option *ngFor="let profesor of profesores" [value]="profesor.id">
                      {{ profesor.name }} - {{ profesor.especialidad || 'Sin especialidad' }}
                    </option>
                  </select>
                </div>
                
                <div class="wp-form-group">
                  <label class="wp-label">Año *</label>
                  <select 
                    formControlName="anio"
                    class="wp-select">
                    <option value="1">1er Año</option>
                    <option value="2">2do Año</option>
                    <option value="3">3er Año</option>
                    <option value="4">4to Año</option>
                    <option value="5">5to Año</option>
                    <option value="6">6to Año</option>
                  </select>
                </div>
              </div>

              <div class="wp-form-row wp-form-row-3">
                <div class="wp-form-group">
                  <label class="wp-label">Cuatrimestre</label>
                  <select 
                    formControlName="cuatrimestre"
                    class="wp-select">
                    <option value="anual">Anual</option>
                    <option value="1">1er Cuatrimestre</option>
                    <option value="2">2do Cuatrimestre</option>
                  </select>
                </div>
                
                <div class="wp-form-group">
                  <label class="wp-label">Horas Semanales</label>
                  <input 
                    type="number" 
                    formControlName="horas_semanales" 
                    min="1" 
                    max="20"
                    class="wp-input">
                </div>
                
                <div class="wp-form-group">
                  <label class="wp-label">Estado</label>
                  <select 
                    formControlName="estado"
                    class="wp-select">
                    <option value="activa">Activa</option>
                    <option value="inactiva">Inactiva</option>
                  </select>
                </div>
              </div>
              
              <div class="wp-form-row">
                <div class="wp-form-group wp-form-group-full">
                  <label class="wp-label">Descripción</label>
                  <textarea 
                    formControlName="descripcion" 
                    rows="3"
                    placeholder="Descripción de la materia..."
                    class="wp-textarea">
                  </textarea>
                </div>
              </div>
              
              <div class="wp-form-actions">
                <button 
                  *ngIf="editandoMateria"
                  type="button"
                  (click)="cancelarEdicion()"
                  class="wp-button wp-button-secondary">
                  Cancelar
                </button>
                <button 
                  type="submit"
                  [disabled]="formulario.invalid || cargando"
                  class="wp-button wp-button-primary">
                  <span *ngIf="cargando" class="wp-spinner"></span>
                  {{ editandoMateria ? 'Actualizar' : 'Crear' }} Materia
                </button>
              </div>
            </form>
          </div>
        </div>

        <!-- TABLA DE MATERIAS ESTILO ARGON -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div class="px-6 py-4 border-b border-gray-200">
            <h2 class="text-lg font-semibold text-gray-900 flex items-center">
              <svg class="w-5 h-5 text-blue-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
              </svg>
              Materias Registradas ({{ materiasFiltradas.length }})
            </h2>
            <p class="text-sm text-gray-600 mt-1">Lista completa de materias del instituto</p>
          </div>
          <div class="p-6">

            <!-- Loading State -->
            <div *ngIf="cargandoMaterias" class="flex justify-center items-center py-12">
              <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
              <p class="ml-4 text-gray-600">Cargando materias...</p>
            </div>

            <!-- Empty State -->
            <div *ngIf="!cargandoMaterias && materiasFiltradas.length === 0" class="text-center py-12">
              <svg class="mx-auto h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              <h3 class="mt-4 text-lg font-bold text-gray-900">No hay materias registradas</h3>
              <p class="mt-2 text-sm text-gray-500">Comienza creando tu primera materia</p>
            </div>

            <!-- TABLA ESTILO ARGON -->
            <div *ngIf="!cargandoMaterias && materiasFiltradas.length > 0" class="overflow-x-auto">
              <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                  <tr>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Materia
                    </th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Carrera
                    </th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Año
                    </th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Profesor
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
                  <tr *ngFor="let materia of materiasFiltradas" class="hover:bg-gray-50">
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="flex items-center">
                        <div class="flex-shrink-0 h-10 w-10">
                          <div class="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-medium text-sm">
                            {{ materia.nombre.charAt(0).toUpperCase() }}
                          </div>
                        </div>
                        <div class="ml-4">
                          <div class="text-sm font-medium text-gray-900">
                            {{ materia.nombre }}
                          </div>
                          <div class="text-sm text-gray-500">
                            {{ materia.codigo }}
                          </div>
                          <div *ngIf="materia.descripcion" class="text-xs text-gray-400 mt-1 max-w-xs truncate">
                            {{ materia.descripcion }}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="text-sm font-medium text-gray-900">
                        {{ materia.carrera_nombre }}
                      </div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="text-sm text-gray-900">
                        {{ materia.anio }}° Año
                      </div>
                      <div class="text-xs text-gray-500">
                        {{ getCuatrimestreLabel(materia.cuatrimestre) }}
                      </div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="text-sm text-gray-900">
                        {{ materia.profesor_nombre || 'Sin asignar' }}
                      </div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                            [ngClass]="{
                              'bg-green-100 text-green-800': materia.estado === 'activa',
                              'bg-red-100 text-red-800': materia.estado === 'inactiva'
                            }">
                        {{ materia.estado }}
                      </span>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div class="flex space-x-3">
                        <button (click)="editarMateria(materia)"
                                class="text-blue-600 hover:text-blue-900">
                          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                          </svg>
                        </button>
                        <button (click)="eliminarMateria(materia)"
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

            <!-- Paginación simple -->
            <div *ngIf="!cargandoMaterias && materiasFiltradas.length > 0" class="flex items-center justify-between mt-6">
              <div class="text-sm text-gray-700">
                Mostrando {{ materiasFiltradas.length }} de {{ materias.length }} materias
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
    </div>

    <style>
      .animate-spin {
        animation: spin 1s linear infinite;
      }
      
      @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
      }
      
      .wp-form {
        max-width: none;
      }

      .wp-form-row {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 15px;
        margin-bottom: 15px;
      }

      .wp-form-row-3 {
        grid-template-columns: 1fr 1fr 1fr;
      }

      .wp-form-group {
        display: flex;
        flex-direction: column;
      }

      .wp-form-group-full {
        grid-column: 1 / -1;
      }

      .wp-label {
        font-size: 13px;
        font-weight: 600;
        color: #23282d;
        margin-bottom: 5px;
        display: block;
      }

      .wp-input, .wp-select, .wp-textarea {
        width: 100%;
        padding: 8px 12px;
        border: 1px solid #d1d5db;
        border-radius: 8px;
        font-size: 14px;
        line-height: 1.4;
        background: white;
        transition: all 0.2s;
      }

      .wp-input:focus, .wp-select:focus, .wp-textarea:focus {
        border-color: #6366f1;
        box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
        outline: none;
      }

      .wp-input-error {
        border-color: #ef4444;
      }

      .wp-error-message {
        color: #ef4444;
        font-size: 12px;
        margin-top: 3px;
      }

      .wp-button {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        text-decoration: none;
        font-size: 14px;
        font-weight: 600;
        min-height: 40px;
        margin: 0;
        padding: 0 16px;
        cursor: pointer;
        border-width: 1px;
        border-style: solid;
        border-radius: 8px;
        white-space: nowrap;
        box-sizing: border-box;
        transition: all 0.2s;
      }

      .wp-button-primary {
        background: linear-gradient(to right, #6366f1, #8b5cf6);
        border-color: transparent;
        color: white;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
      }

      .wp-button-primary:hover {
        background: linear-gradient(to right, #4f46e5, #7c3aed);
        transform: translateY(-1px);
        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
      }

      .wp-button-secondary {
        background: #f3f4f6;
        border-color: #d1d5db;
        color: #374151;
      }

      .wp-button-secondary:hover {
        background: #e5e7eb;
        border-color: #9ca3af;
      }

      .wp-form-actions {
        display: flex;
        gap: 12px;
        justify-content: flex-end;
        margin-top: 24px;
        padding-top: 20px;
        border-top: 1px solid #e5e7eb;
      }

      .wp-spinner {
        display: inline-block;
        width: 16px;
        height: 16px;
        border: 2px solid #f3f3f3;
        border-top: 2px solid #6366f1;
        border-radius: 50%;
        animation: spin 1s linear infinite;
        margin-right: 8px;
      }

      /* Responsive */
      @media (max-width: 768px) {
        .wp-form-row, .wp-form-row-3 {
          grid-template-columns: 1fr;
        }
      }
    </style>
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
  mostrarFormulario = true;
  
  filtroCarrera = '';
  filtroAnio = '';
  busquedaTexto = '';

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
        console.log('Materias cargadas:', materias);
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
      const cumpleBusqueda = !this.busquedaTexto || 
        materia.nombre.toLowerCase().includes(this.busquedaTexto.toLowerCase()) ||
        materia.codigo.toLowerCase().includes(this.busquedaTexto.toLowerCase());
      return cumpleCarrera && cumpleAnio && cumpleBusqueda;
    });
  }

  limpiarFiltros(): void {
    this.filtroCarrera = '';
    this.filtroAnio = '';
    this.busquedaTexto = '';
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
      next: (response) => {
        const mensaje = this.editandoMateria ? 'actualizada' : 'creada';
        Swal.fire('¡Éxito!', `Materia ${mensaje} correctamente`, 'success');
        
        // Recargar tanto materias como profesores para asegurar datos actualizados
        this.cargarMaterias();
        this.cargarProfesores();
        this.resetFormulario();
        this.cargando = false;
        
        console.log('Materia guardada exitosamente:', response);
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

  getMateriasActivas(): number {
    return this.materias.filter(materia => materia.estado === 'activa').length;
  }

  getMateriasConProfesor(): number {
    return this.materias.filter(materia => materia.profesor_id && materia.profesor_id !== '').length;
  }

  toggleFormulario(): void {
    this.mostrarFormulario = !this.mostrarFormulario;
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
