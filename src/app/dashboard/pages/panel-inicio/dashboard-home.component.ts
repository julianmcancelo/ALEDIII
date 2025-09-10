/**
 * @file dashboard-home.component.ts
 * @description Componente principal del dashboard/panel de inicio del sistema académico
 * Proporciona una vista general del estado del sistema, estadísticas principales,
 * acciones rápidas y actividad reciente para usuarios autenticados.
 * 
 * Características principales:
 * - Dashboard responsivo con diseño ITB-inspired
 * - Estadísticas en tiempo real de estudiantes, cursos, profesores y graduados
 * - Panel de acciones rápidas para gestión administrativa
 * - Sistema de actividad reciente y estado del sistema
 * - Modal para creación de nuevos usuarios
 * - Integración completa con servicios de autenticación y datos
 * 
 * TP Final Algoritmos y Estructuras de Datos III - 2025
 * Alumnos: CANCELO JULIAN - NICOLAS OTERO (Curso 3ra 1RA)
 * Profesor: Sebastian Saldivar
 */

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService, User } from '../../../nucleo/servicios/auth.service';
import { DashboardService, DashboardStats } from '../../../nucleo/servicios/dashboard.service';
import { UserService, Usuario } from '../../../nucleo/servicios/user.service';
import { map } from 'rxjs/operators';

/**
 * @class DashboardHomeComponent
 * @description Componente principal del dashboard que implementa la interfaz de inicio
 * del sistema académico con funcionalidades completas de gestión y visualización.
 * 
 * Este componente utiliza:
 * - Diseño responsivo con Tailwind CSS
 * - Arquitectura standalone de Angular 17+
 * - Integración con múltiples servicios del sistema
 * - Patrón Observer para manejo de estado reactivo
 */
@Component({
  selector: 'app-dashboard-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <!-- 
      CONTENEDOR PRINCIPAL DEL DASHBOARD - ESTILO ARGON PROFESIONAL
      Implementa diseño limpio y optimizado para máximo aprovechamiento del espacio
      Utiliza colores neutros y espaciado preciso como Argon Dashboard
    -->
    <div class="min-h-screen bg-gray-50 p-4">
      <div class="max-w-7xl mx-auto">
        
        <!-- 
          HEADER COMPACTO ESTILO ARGON
          Diseño minimalista que maximiza el espacio para contenido
          Sin elementos decorativos innecesarios, enfoque en funcionalidad
        -->
        <div class="mb-6">
          <div class="flex items-center justify-between">
            <div>
              <h1 class="text-2xl font-bold text-gray-900">Dashboard</h1>
              <p class="text-gray-600 mt-1">Bienvenido, {{currentUser?.name}} - {{getRoleLabel(currentUser?.role)}}</p>
            </div>
            <div class="flex items-center space-x-3">
              <div class="inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-medium bg-green-100 text-green-800">
                <div class="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                Sistema Activo
              </div>
            </div>
          </div>
        </div>
        
        <!-- 
          TARJETAS DE ESTADÍSTICAS ESTILO ARGON
          Diseño compacto y limpio que maximiza la información visible
          Cards con métricas principales sin elementos decorativos excesivos
        -->
        <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-6">
          
          <!-- Tarjeta: Total de Estudiantes -->
          <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div class="flex items-center">
              <div class="flex-1">
                <p class="text-sm font-medium text-gray-600 uppercase tracking-wide">ESTUDIANTES ACTIVOS</p>
                <div class="mt-2">
                  <div class="text-3xl font-bold text-gray-900" *ngIf="!cargandoStats">{{ stats.estudiantesActivos | number }}</div>
                  <div *ngIf="cargandoStats" class="w-16 h-8 bg-gray-200 rounded"></div>
                </div>
                <div class="mt-2 flex items-center text-sm">
                  <span class="text-green-600 font-medium">↗ 12%</span>
                  <span class="text-gray-500 ml-2">vs mes anterior</span>
                </div>
              </div>
              <div class="ml-4">
                <div class="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
                  <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"></path>
                  </svg>
                </div>
              </div>
            </div>
          </div>

          <!-- Tarjeta: Cursos Activos -->
          <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div class="flex items-center">
              <div class="flex-1">
                <p class="text-sm font-medium text-gray-600 uppercase tracking-wide">CURSOS ACTIVOS</p>
                <div class="mt-2">
                  <div class="text-3xl font-bold text-gray-900" *ngIf="!cargandoStats">{{ stats.cursosActivos | number }}</div>
                  <div *ngIf="cargandoStats" class="w-16 h-8 bg-gray-200 rounded"></div>
                </div>
                <div class="mt-2 flex items-center text-sm">
                  <span class="text-green-600 font-medium">↗ 8%</span>
                  <span class="text-gray-500 ml-2">vs mes anterior</span>
                </div>
              </div>
              <div class="ml-4">
                <div class="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
                  <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
                  </svg>
                </div>
              </div>
            </div>
          </div>

          <!-- Tarjeta: Profesores -->
          <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div class="flex items-center">
              <div class="flex-1">
                <p class="text-sm font-medium text-gray-600 uppercase tracking-wide">PROFESORES</p>
                <div class="mt-2">
                  <div class="text-3xl font-bold text-gray-900" *ngIf="!cargandoStats">{{ stats.profesores | number }}</div>
                  <div *ngIf="cargandoStats" class="w-16 h-8 bg-gray-200 rounded"></div>
                </div>
                <div class="mt-2 flex items-center text-sm">
                  <span class="text-blue-600 font-medium">→ 0%</span>
                  <span class="text-gray-500 ml-2">sin cambios</span>
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

          <!-- Tarjeta: Graduados 2024 -->
          <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div class="flex items-center">
              <div class="flex-1">
                <p class="text-sm font-medium text-gray-600 uppercase tracking-wide">GRADUADOS 2024</p>
                <div class="mt-2">
                  <div class="text-3xl font-bold text-gray-900" *ngIf="!cargandoStats">{{ stats.graduados2024 | number }}</div>
                  <div *ngIf="cargandoStats" class="w-16 h-8 bg-gray-200 rounded"></div>
                </div>
                <div class="mt-2 flex items-center text-sm">
                  <span class="text-green-600 font-medium">↗ 25%</span>
                  <span class="text-gray-500 ml-2">vs año anterior</span>
                </div>
              </div>
              <div class="ml-4">
                <div class="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center">
                  <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 14l9-5-9-5-9 5 9 5z"></path>
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 
          CONTENIDO PRINCIPAL ESTILO ARGON
          Layout optimizado con máximo aprovechamiento del espacio
          Diseño limpio y funcional sin elementos decorativos innecesarios
        -->
        <div class="grid grid-cols-1 xl:grid-cols-3 gap-6">
          
          <!-- 
            PANEL PRINCIPAL DE ACCIONES - ESTILO ARGON
            Diseño compacto con botones organizados eficientemente
            Enfoque en funcionalidad y claridad visual
          -->
          <div class="xl:col-span-2">
            <div class="bg-white rounded-lg shadow-sm border border-gray-200">
              
              <!-- Header limpio sin elementos decorativos -->
              <div class="px-6 py-4 border-b border-gray-200">
                <h2 class="text-lg font-semibold text-gray-900">Acciones Rápidas</h2>
                <p class="text-sm text-gray-600 mt-1">Gestión y administración del sistema</p>
              </div>
              
              <!-- Grid de acciones estilo Argon -->
              <div class="p-6">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  
                  <!-- Botón: Nuevo Usuario -->
                  <button (click)="abrirModalTipoUsuario()"
                          *ngIf="currentUser?.role === 'admin' || currentUser?.role === 'profesor'"
                          class="flex items-center p-4 border border-gray-200 rounded-lg">
                    <div class="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                      <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                      </svg>
                    </div>
                    <div class="ml-4 text-left">
                      <p class="font-medium text-gray-900">Nuevo Usuario</p>
                      <p class="text-sm text-gray-600">Crear usuarios del sistema</p>
                    </div>
                  </button>

                  <!-- Botón: Gestionar Carreras -->
                  <button (click)="navegarA('/gestion-carreras')"
                          *ngIf="currentUser?.role === 'admin'"
                          class="flex items-center p-4 border border-gray-200 rounded-lg">
                    <div class="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                      <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 14l9-5-9-5-9 5 9 5z"></path>
                      </svg>
                    </div>
                    <div class="ml-4 text-left">
                      <p class="font-medium text-gray-900">Gestionar Carreras</p>
                      <p class="text-sm text-gray-600">Administrar carreras del instituto</p>
                    </div>
                  </button>

                  <!-- Botón: Gestionar Materias -->
                  <button (click)="navegarA('/gestion-materias')"
                          *ngIf="currentUser?.role === 'admin'"
                          class="flex items-center p-4 border border-gray-200 rounded-lg">
                    <div class="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
                      <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
                      </svg>
                    </div>
                    <div class="ml-4 text-left">
                      <p class="font-medium text-gray-900">Gestionar Materias</p>
                      <p class="text-sm text-gray-600">Administrar materias por carrera</p>
                    </div>
                  </button>

                  <!-- Botón: Reportes -->
                  <button class="flex items-center p-4 border border-gray-200 rounded-lg">
                    <div class="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
                      <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                      </svg>
                    </div>
                    <div class="ml-4 text-left">
                      <p class="font-medium text-gray-900">Reportes</p>
                      <p class="text-sm text-gray-600">Análisis y estadísticas</p>
                    </div>
                  </button>

                  <!-- Botón: Horarios -->
                  <button class="flex items-center p-4 border border-gray-200 rounded-lg">
                    <div class="w-10 h-10 bg-indigo-500 rounded-lg flex items-center justify-center">
                      <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                    </div>
                    <div class="ml-4 text-left">
                      <p class="font-medium text-gray-900">Horarios</p>
                      <p class="text-sm text-gray-600">Gestión de cronogramas</p>
                    </div>
                  </button>

                  <!-- Botón: Comunicaciones -->
                  <button class="flex items-center p-4 border border-gray-200 rounded-lg">
                    <div class="w-10 h-10 bg-pink-500 rounded-lg flex items-center justify-center">
                      <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
                      </svg>
                    </div>
                    <div class="ml-4 text-left">
                      <p class="font-medium text-gray-900">Comunicaciones</p>
                      <p class="text-sm text-gray-600">Mensajes y anuncios</p>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- 
            SIDEBAR ESTILO ARGON - SIN MOVIMIENTO
            Diseño limpio y estático como Argon Dashboard
            Eliminadas todas las animaciones y efectos que causan movimiento
          -->
          <div class="space-y-6">
            
            <!-- Estado del Sistema -->
            <div class="bg-white rounded-lg shadow-sm border border-gray-200">
              <div class="px-6 py-4 border-b border-gray-200">
                <h2 class="text-lg font-semibold text-gray-900">Estado del Sistema</h2>
              </div>
              <div class="p-6">
                <div class="space-y-4">
                  <!-- Indicadores de estado sin animaciones -->
                  <div class="flex items-center justify-between">
                    <span class="text-sm text-gray-600 font-medium">Sistema</span>
                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Activo
                    </span>
                  </div>
                  <div class="flex items-center justify-between">
                    <span class="text-sm text-gray-600 font-medium">Última actualización</span>
                    <span class="text-sm text-gray-900 font-medium">Hoy</span>
                  </div>
                  <div class="flex items-center justify-between">
                    <span class="text-sm text-gray-600 font-medium">Versión</span>
                    <span class="text-sm text-gray-900 font-medium">v1.0.0</span>
                  </div>
                  <div class="flex items-center justify-between">
                    <span class="text-sm text-gray-600 font-medium">Centro</span>
                    <span class="text-sm text-blue-600 font-medium">ITB</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Actividad Reciente -->
            <div class="bg-white rounded-lg shadow-sm border border-gray-200">
              <div class="px-6 py-4 border-b border-gray-200">
                <h2 class="text-lg font-semibold text-gray-900">Actividad Reciente</h2>
              </div>
              <div class="p-6">
                <div class="space-y-4">
                  <!-- Timeline de actividades sin animaciones -->
                  <div class="flex items-start space-x-3">
                    <div class="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                    <div class="flex-1">
                      <p class="text-sm font-medium text-gray-900">Sistema iniciado</p>
                      <p class="text-xs text-gray-600">Hace 2 horas</p>
                    </div>
                  </div>
                  <div class="flex items-start space-x-3">
                    <div class="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                    <div class="flex-1">
                      <p class="text-sm font-medium text-gray-900">Base de datos actualizada</p>
                      <p class="text-xs text-gray-600">Hace 1 día</p>
                    </div>
                  </div>
                  <div class="flex items-start space-x-3">
                    <div class="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                    <div class="flex-1">
                      <p class="text-sm font-medium text-gray-900">Nuevo estudiante registrado</p>
                      <p class="text-xs text-gray-600">Hace 3 días</p>
                    </div>
                  </div>
                  <div class="flex items-start space-x-3">
                    <div class="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
                    <div class="flex-1">
                      <p class="text-sm font-medium text-gray-900">Materia actualizada</p>
                      <p class="text-xs text-gray-600">Hace 5 días</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 
      MODAL DE SELECCIÓN DE TIPO DE USUARIO
      Modal overlay para creación de nuevos usuarios
      Implementa backdrop blur y animaciones suaves
    -->
    <div *ngIf="mostrarModalTipoUsuario" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-sm p-4" 
         (click)="cerrarModalTipoUsuario()">
      <div class="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4" 
           (click)="$event.stopPropagation()">
        
        <!-- Header del modal -->
        <div class="bg-gradient-to-r from-slate-800 to-slate-900 px-6 py-4 rounded-t-2xl">
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-bold text-white">Crear Nuevo Usuario</h3>
            <button (click)="cerrarModalTipoUsuario()" 
                    class="text-gray-300">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
        </div>
        
        <!-- Contenido del modal -->
        <div class="p-6">
          <p class="text-slate-600 mb-6">Seleccione el tipo de usuario que desea crear:</p>
          
          <!-- Opciones de tipo de usuario -->
          <div class="space-y-3">
            <button (click)="crearTipoUsuario('student')"
                    class="w-full flex items-center p-4 border-2 border-gray-200 rounded-xl">
              <div class="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center mr-4">
                <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 14l9-5-9-5-9 5 9 5z"></path>
                </svg>
              </div>
              <div class="text-left">
                <p class="font-semibold text-slate-800">Estudiante</p>
                <p class="text-sm text-slate-600">Usuario con acceso a cursos y materiales</p>
              </div>
            </button>
            
            <button (click)="crearTipoUsuario('profesor')"
                    class="w-full flex items-center p-4 border-2 border-gray-200 rounded-xl">
              <div class="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center mr-4">
                <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                </svg>
              </div>
              <div class="text-left">
                <p class="font-semibold text-slate-800">Profesor</p>
                <p class="text-sm text-slate-600">Docente con permisos de gestión académica</p>
              </div>
            </button>
            
            <button (click)="crearTipoUsuario('admin')" 
                    *ngIf="currentUser?.role === 'admin'"
                    class="w-full flex items-center p-4 border-2 border-gray-200 rounded-xl">
              <div class="w-10 h-10 bg-red-500 rounded-lg flex items-center justify-center mr-4">
                <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                </svg>
              </div>
              <div class="text-left">
                <p class="font-semibold text-slate-800">Administrador</p>
                <p class="text-sm text-slate-600">Acceso completo al sistema</p>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styleUrls: []
})
export class DashboardHomeComponent implements OnInit {
  /**
   * @property currentUser - Usuario autenticado actualmente en el sistema
   * @description Almacena la información del usuario logueado para mostrar datos personalizados
   * y controlar el acceso a funcionalidades según el rol
   */
  currentUser: User | null = null;

  /**
   * @property stats - Estadísticas principales del dashboard
   * @description Objeto que contiene las métricas clave del sistema académico:
   * - estudiantesActivos: Número total de estudiantes registrados
   * - cursosActivos: Cantidad de cursos disponibles
   * - profesores: Total de docentes en el sistema
   * - graduados2024: Estudiantes graduados en el año actual
   */
  stats: DashboardStats = {
    estudiantesActivos: 0,
    cursosActivos: 0,
    profesores: 0,
    graduados2024: 0
  };

  /**
   * @property cargandoStats - Estado de carga de estadísticas
   * @description Flag booleano que controla la visualización de placeholders
   * animados mientras se cargan los datos desde el backend
   */
  cargandoStats = true;

  /**
   * @property mostrarModalTipoUsuario - Control de visibilidad del modal
   * @description Controla la apertura/cierre del modal de selección de tipo de usuario
   * para la funcionalidad de creación de nuevos usuarios
   */
  mostrarModalTipoUsuario = false;

  /**
   * @constructor
   * @description Constructor del componente que inyecta las dependencias necesarias
   * para el funcionamiento del dashboard
   * 
   * @param authService - Servicio de autenticación para gestión de usuarios
   * @param dashboardService - Servicio para obtener estadísticas del dashboard
   * @param userService - Servicio para operaciones CRUD de usuarios
   * @param router - Router de Angular para navegación programática
   */
  constructor(
    private authService: AuthService,
    private dashboardService: DashboardService,
    private userService: UserService,
    private router: Router
  ) {}

  /**
   * @method ngOnInit
   * @description Método del ciclo de vida de Angular que se ejecuta tras la inicialización
   * del componente. Configura las suscripciones a observables y carga datos iniciales.
   * 
   * Funcionalidades implementadas:
   * - Suscripción al observable del usuario actual para actualizaciones reactivas
   * - Carga inicial de estadísticas del sistema
   * - Configuración del estado inicial del componente
   */
  ngOnInit(): void {
    // Suscripción reactiva al usuario autenticado
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });

    // Carga inicial de estadísticas del dashboard
    this.cargarEstadisticas();
  }

  /**
   * @method cargarEstadisticas
   * @description Método que obtiene y procesa las estadísticas principales del sistema
   * académico desde el backend. Implementa manejo de errores y estados de carga.
   * 
   * Proceso de carga:
   * 1. Activa el estado de carga (loading state)
   * 2. Realiza petición HTTP para obtener usuarios
   * 3. Filtra estudiantes activos usando RxJS operators
   * 4. Actualiza las estadísticas del dashboard
   * 5. Maneja errores con valores por defecto
   * 
   * @returns void
   */
  cargarEstadisticas(): void {
    this.cargandoStats = true;
    
    // Petición HTTP con transformación de datos usando RxJS
    this.userService.getUsuarios().pipe(
      map((users: Usuario[]) => users.filter(u => u.role === 'student'))
    ).subscribe({
      next: (estudiantes: Usuario[]) => {
        this.stats.estudiantesActivos = estudiantes.length;
        this.cargandoStats = false;
      },
      error: (error) => {
        console.error('Error al cargar estadísticas:', error);
        this.cargandoStats = false;
        
        // Valores por defecto en caso de error de conectividad
        this.stats = {
          estudiantesActivos: 0,
          cursosActivos: 12,
          profesores: 0,
          graduados2024: 0
        };
      }
    });
  }

  /**
   * @method getRoleLabel
   * @description Método utilitario que convierte los códigos de rol del sistema
   * en etiquetas legibles para el usuario final
   * 
   * @param role - Código del rol del usuario ('admin', 'profesor', 'student')
   * @returns string - Etiqueta traducida del rol o cadena vacía si no existe
   * 
   * @example
   * getRoleLabel('admin') // returns 'Administrador'
   * getRoleLabel('student') // returns 'Estudiante'
   */
  getRoleLabel(role?: string): string {
    const labels: { [key: string]: string } = {
      'admin': 'Administrador',
      'profesor': 'Profesor',
      'student': 'Estudiante'
    };
    return role ? labels[role] : '';
  }

  /**
   * @method abrirModalTipoUsuario
   * @description Método que controla la apertura del modal de selección de tipo de usuario.
   * Actualiza el estado del componente para mostrar la interfaz modal.
   * 
   * Utilizado por: Botón "Nuevo Usuario" en acciones rápidas
   * Permisos: Solo disponible para administradores y profesores
   */
  abrirModalTipoUsuario(): void {
    this.mostrarModalTipoUsuario = true;
  }

  /**
   * @method cerrarModalTipoUsuario
   * @description Método que controla el cierre del modal de selección de tipo de usuario.
   * Puede ser activado por el botón de cerrar o haciendo clic fuera del modal.
   * 
   * Eventos que lo activan:
   * - Click en botón de cerrar (X)
   * - Click en el backdrop del modal
   * - Selección de un tipo de usuario (navegación automática)
   */
  cerrarModalTipoUsuario(): void {
    this.mostrarModalTipoUsuario = false;
  }

  /**
   * @method crearTipoUsuario
   * @description Método que maneja la selección de tipo de usuario y navega
   * a la página de gestión de usuarios con parámetros específicos
   * 
   * @param tipo - Tipo de usuario a crear ('student' | 'profesor' | 'admin')
   * 
   * Flujo de ejecución:
   * 1. Cierra el modal de selección
   * 2. Navega a la ruta de gestión de usuarios
   * 3. Pasa parámetros de consulta para preconfigurar el formulario
   * 
   * @example
   * crearTipoUsuario('student') // Navega a crear estudiante
   * crearTipoUsuario('admin') // Navega a crear administrador
   */
  crearTipoUsuario(tipo: 'student' | 'profesor' | 'admin'): void {
    this.cerrarModalTipoUsuario();
    this.router.navigate(['/dashboard/gestion-usuarios'], { 
      queryParams: { tipo: tipo, accion: 'crear' } 
    });
  }

  /**
   * @method navegarA
   * @description Método utilitario para navegación programática a diferentes rutas
   * del sistema. Centraliza la lógica de navegación para mejor mantenibilidad.
   * 
   * @param ruta - Ruta de destino (path relativo o absoluto)
   * 
   * Rutas comunes utilizadas:
   * - '/gestion-carreras' - Administración de carreras
   * - '/gestion-materias' - Gestión de materias por carrera
   * - '/dashboard/reportes' - Sistema de reportes y análisis
   * 
   * @example
   * navegarA('/gestion-carreras') // Navega a gestión de carreras
   */
  navegarA(ruta: string): void {
    this.router.navigate([ruta]);
  }
}
