/**
 * @file registro-usuario.component.ts
 * @description Componente para el registro de usuarios basado en la estructura MySQL
 * 
 * TP Final Algoritmos y Estructuras de Datos III - 2025
 * Alumnos: CANCELO JULIAN - NICOLAS OTERO (Curso 3ra 1RA)
 * Profesor: Sebastian Saldivar
 */
import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { UserService } from '../../../nucleo/servicios/user.service';
import { CreateUserRequest, UserRole, Departamento } from '../../../nucleo/modelos/user.model';
import Swal from 'sweetalert2';

// Usamos los tipos definidos en user.model.ts

@Component({
  selector: 'app-registro-usuario',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-8 px-4 sm:px-6 lg:px-8">
      <div class="max-w-2xl w-full mx-auto">
        <!-- Argon-style Header -->
        <div class="bg-white rounded-3xl shadow-2xl mb-8 overflow-hidden border border-gray-100">
          <div class="bg-gradient-to-r from-sky-400 via-blue-500 to-blue-800 px-8 py-8 relative overflow-hidden">
            <div class="absolute inset-0 bg-black opacity-10"></div>
            <div class="relative z-10 text-center">
              <div class="flex justify-center mb-4">
                <div class="w-16 h-16 bg-white bg-opacity-20 rounded-3xl flex items-center justify-center backdrop-blur-sm">
                  <svg class="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"></path>
                  </svg>
                </div>
              </div>
              <h1 class="text-4xl font-bold text-white mb-2">Registro de Usuario</h1>
              <p class="text-white text-opacity-90 text-lg">Completa el formulario para crear un nuevo usuario en el sistema</p>
            </div>
          </div>
        </div>

        <!-- Selector de tipo de usuario -->
        <div class="bg-white rounded-3xl shadow-xl p-8 mb-8 border border-gray-100">
          <div class="bg-gradient-to-r from-sky-50 to-blue-50 px-6 py-4 rounded-2xl mb-6 border border-blue-100">
            <h2 class="text-xl font-bold text-blue-800 mb-2 flex items-center">
              <div class="w-8 h-8 bg-gradient-to-r from-sky-400 to-blue-600 rounded-xl flex items-center justify-center mr-3">
                <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                </svg>
              </div>
              Tipo de Usuario
            </h2>
            <p class="text-blue-600 text-sm">Selecciona el tipo de usuario que deseas registrar</p>
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <button
              type="button"
              (click)="cambiarTipoUsuario('student')"
              class="flex flex-col items-center justify-center p-6 rounded-2xl border-2 transition-all duration-200 shadow-sm hover:shadow-lg transform hover:-translate-y-1"
              [class.border-blue-400]="tipoUsuario === 'student'"
              [class.bg-gradient-to-br]="tipoUsuario === 'student'"
              [class.from-sky-50]="tipoUsuario === 'student'"
              [class.to-blue-100]="tipoUsuario === 'student'"
              [class.shadow-lg]="tipoUsuario === 'student'"
              [class.border-gray-200]="tipoUsuario !== 'student'"
              [class.hover:border-blue-300]="tipoUsuario !== 'student'"
            >
              <div class="w-12 h-12 rounded-2xl flex items-center justify-center mb-3" 
                   [class.bg-gradient-to-r]="tipoUsuario === 'student'"
                   [class.from-sky-400]="tipoUsuario === 'student'"
                   [class.to-blue-600]="tipoUsuario === 'student'"
                   [class.bg-gray-100]="tipoUsuario !== 'student'">
                <svg class="w-7 h-7" [ngClass]="{'text-white': tipoUsuario === 'student', 'text-gray-500': tipoUsuario !== 'student'}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 14l9-5-9-5-9 5 9 5z"></path>
                </svg>
              </div>
              <span class="font-bold text-lg" [ngClass]="{'text-blue-800': tipoUsuario === 'student', 'text-gray-700': tipoUsuario !== 'student'}">Estudiante</span>
              <span class="text-sm text-center mt-1" [ngClass]="{'text-blue-600': tipoUsuario === 'student', 'text-gray-500': tipoUsuario !== 'student'}">Acceso a materiales y calificaciones</span>
            </button>

            <button
              type="button"
              (click)="cambiarTipoUsuario('profesor')"
              class="flex flex-col items-center justify-center p-6 rounded-2xl border-2 transition-all duration-200 shadow-sm hover:shadow-lg transform hover:-translate-y-1"
              [class.border-blue-400]="tipoUsuario === 'profesor'"
              [class.bg-gradient-to-br]="tipoUsuario === 'profesor'"
              [class.from-sky-50]="tipoUsuario === 'profesor'"
              [class.to-blue-100]="tipoUsuario === 'profesor'"
              [class.shadow-lg]="tipoUsuario === 'profesor'"
              [class.border-gray-200]="tipoUsuario !== 'profesor'"
              [class.hover:border-blue-300]="tipoUsuario !== 'profesor'"
            >
              <div class="w-12 h-12 rounded-2xl flex items-center justify-center mb-3" 
                   [class.bg-gradient-to-r]="tipoUsuario === 'profesor'"
                   [class.from-sky-400]="tipoUsuario === 'profesor'"
                   [class.to-blue-600]="tipoUsuario === 'profesor'"
                   [class.bg-gray-100]="tipoUsuario !== 'profesor'">
                <svg class="w-7 h-7" [ngClass]="{'text-white': tipoUsuario === 'profesor', 'text-gray-500': tipoUsuario !== 'profesor'}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                </svg>
              </div>
              <span class="font-bold text-lg" [ngClass]="{'text-blue-800': tipoUsuario === 'profesor', 'text-gray-700': tipoUsuario !== 'profesor'}">Profesor</span>
              <span class="text-sm text-center mt-1" [ngClass]="{'text-blue-600': tipoUsuario === 'profesor', 'text-gray-500': tipoUsuario !== 'profesor'}">Gestión de clases y evaluaciones</span>
            </button>

            <button
              type="button"
              (click)="cambiarTipoUsuario('admin')"
              class="flex flex-col items-center justify-center p-6 rounded-2xl border-2 transition-all duration-200 shadow-sm hover:shadow-lg transform hover:-translate-y-1"
              [class.border-blue-400]="tipoUsuario === 'admin'"
              [class.bg-gradient-to-br]="tipoUsuario === 'admin'"
              [class.from-sky-50]="tipoUsuario === 'admin'"
              [class.to-blue-100]="tipoUsuario === 'admin'"
              [class.shadow-lg]="tipoUsuario === 'admin'"
              [class.border-gray-200]="tipoUsuario !== 'admin'"
              [class.hover:border-blue-300]="tipoUsuario !== 'admin'"
            >
              <div class="w-12 h-12 rounded-2xl flex items-center justify-center mb-3" 
                   [class.bg-gradient-to-r]="tipoUsuario === 'admin'"
                   [class.from-sky-400]="tipoUsuario === 'admin'"
                   [class.to-blue-600]="tipoUsuario === 'admin'"
                   [class.bg-gray-100]="tipoUsuario !== 'admin'">
                <svg class="w-7 h-7" [ngClass]="{'text-white': tipoUsuario === 'admin', 'text-gray-500': tipoUsuario !== 'admin'}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                </svg>
              </div>
              <span class="font-bold text-lg" [ngClass]="{'text-blue-800': tipoUsuario === 'admin', 'text-gray-700': tipoUsuario !== 'admin'}">Administrador</span>
              <span class="text-sm text-center mt-1" [ngClass]="{'text-blue-600': tipoUsuario === 'admin', 'text-gray-500': tipoUsuario !== 'admin'}">Control total del sistema</span>
            </button>
          </div>
        </div>

        <!-- Información del rol seleccionado -->
        <div class="bg-white rounded-3xl shadow-xl p-8 mb-8 border border-gray-100 border-l-4 border-l-blue-500">
          <div class="flex items-start">
            <div class="flex-shrink-0 mr-4">
              <div class="w-12 h-12 bg-gradient-to-r from-sky-400 to-blue-600 rounded-2xl flex items-center justify-center">
                <svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
            </div>
            <div class="flex-1">
              <h3 class="text-xl font-bold text-blue-800 mb-2">{{ getTitulo() }}</h3>
              <p class="text-blue-600 leading-relaxed">{{ getDescripcionRol() }}</p>
            </div>
          </div>
        </div>

        <!-- Formulario -->
        <div class="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
          <div class="bg-gradient-to-r from-sky-50 to-blue-50 px-8 py-6 border-b border-blue-100">
            <h2 class="text-xl font-bold text-blue-800 flex items-center">
              <div class="w-8 h-8 bg-gradient-to-r from-sky-400 to-blue-600 rounded-xl flex items-center justify-center mr-3">
                <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                </svg>
              </div>
              Datos del Usuario
            </h2>
            <p class="text-blue-600 text-sm mt-1">Complete la información requerida para el registro</p>
          </div>

          <div class="p-8">
            <form [formGroup]="formulario" (ngSubmit)="crearUsuario()">
              <!-- Campos del formulario -->
              <div class="space-y-6">
                <!-- Nombre -->
                <div>
                  <label class="block text-sm font-semibold text-blue-700 mb-2">
                    <div class="flex items-center">
                      <svg class="w-4 h-4 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                      </svg>
                      {{ tipoUsuario === 'student' ? 'Nombre del Estudiante' : 
                         tipoUsuario === 'profesor' ? 'Nombre del Profesor' : 'Nombre del Administrador' }}
                    </div>
                  </label>
                  <input 
                    type="text" 
                    formControlName="name" 
                    [placeholder]="getPlaceholderNombre()"
                    class="w-full px-4 py-3 border border-blue-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-all duration-200 shadow-sm bg-blue-50 bg-opacity-50"
                    [class.border-red-500]="formulario.get('name')?.invalid && formulario.get('name')?.touched"
                    [class.bg-red-50]="formulario.get('name')?.invalid && formulario.get('name')?.touched">
                  <div *ngIf="formulario.get('name')?.hasError('required') && formulario.get('name')?.touched" 
                       class="mt-2 text-sm text-red-600 flex items-center">
                    <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    El nombre es requerido
                  </div>
                </div>

                <!-- Email -->
                <div>
                  <label class="block text-sm font-semibold text-blue-700 mb-2">
                    <div class="flex items-center">
                      <svg class="w-4 h-4 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                      </svg>
                      Email
                    </div>
                  </label>
                  <input 
                    type="email" 
                    formControlName="email" 
                    [placeholder]="getPlaceholderEmail()"
                    class="w-full px-4 py-3 border border-blue-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-all duration-200 shadow-sm bg-blue-50 bg-opacity-50"
                    [class.border-red-500]="formulario.get('email')?.invalid && formulario.get('email')?.touched"
                    [class.bg-red-50]="formulario.get('email')?.invalid && formulario.get('email')?.touched">
                  <div *ngIf="formulario.get('email')?.hasError('required') && formulario.get('email')?.touched" 
                       class="mt-2 text-sm text-red-600 flex items-center">
                    <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    El email es requerido
                  </div>
                  <div *ngIf="formulario.get('email')?.hasError('email') && formulario.get('email')?.touched" 
                       class="mt-2 text-sm text-red-600 flex items-center">
                    <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    Ingresa un email válido
                  </div>
                </div>

                <!-- Campos específicos por rol -->
                <div *ngIf="tipoUsuario === 'student'" class="space-y-6">
                  <div>
                    <label class="block text-sm font-semibold text-blue-700 mb-2">
                      <div class="flex items-center">
                        <svg class="w-4 h-4 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V4a2 2 0 114 0v2m-4 0a2 2 0 104 0m-4 0a2 2 0 014 0"></path>
                        </svg>
                        DNI
                      </div>
                    </label>
                    <input 
                      type="text" 
                      formControlName="dni" 
                      placeholder="12345678"
                      class="w-full px-4 py-3 border border-blue-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-all duration-200 shadow-sm bg-blue-50 bg-opacity-50"
                      [class.border-red-500]="formulario.get('dni')?.invalid && formulario.get('dni')?.touched"
                      [class.bg-red-50]="formulario.get('dni')?.invalid && formulario.get('dni')?.touched">
                    <div *ngIf="formulario.get('dni')?.hasError('required') && formulario.get('dni')?.touched" 
                         class="mt-2 text-sm text-red-600 flex items-center">
                      <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                      El DNI es requerido
                    </div>
                  </div>
                  
                  <div>
                    <label class="block text-sm font-semibold text-blue-700 mb-2">
                      <div class="flex items-center">
                        <svg class="w-4 h-4 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                        </svg>
                        Legajo
                      </div>
                    </label>
                    <input 
                      type="text" 
                      formControlName="legajo" 
                      placeholder="Ej: EST-12345"
                      class="w-full px-4 py-3 border border-blue-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-all duration-200 shadow-sm bg-blue-50 bg-opacity-50"
                      [class.border-red-500]="formulario.get('legajo')?.invalid && formulario.get('legajo')?.touched"
                      [class.bg-red-50]="formulario.get('legajo')?.invalid && formulario.get('legajo')?.touched">
                    <div *ngIf="formulario.get('legajo')?.hasError('required') && formulario.get('legajo')?.touched" 
                         class="mt-2 text-sm text-red-600 flex items-center">
                      <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                      El legajo es requerido
                    </div>
                    <div *ngIf="formulario.get('legajo')?.hasError('maxlength') && formulario.get('legajo')?.touched" 
                         class="mt-2 text-sm text-red-600 flex items-center">
                      <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                      El legajo no puede exceder los 20 caracteres
                    </div>
                  </div>
                  
                  <div>
                    <label class="block text-sm font-semibold text-blue-700 mb-2">
                      <div class="flex items-center">
                        <svg class="w-4 h-4 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
                        </svg>
                        Carrera
                      </div>
                    </label>
                    <div class="relative">
                      <select 
                        formControlName="carrera"
                        class="w-full px-4 py-3 border border-blue-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-all duration-200 shadow-sm bg-blue-50 bg-opacity-50 appearance-none"
                        [class.border-red-500]="formulario.get('carrera')?.invalid && formulario.get('carrera')?.touched"
                        [class.bg-red-50]="formulario.get('carrera')?.invalid && formulario.get('carrera')?.touched">
                        <option value="">Seleccionar carrera</option>
                        <option value="Técnico en Informática">Técnico en Informática</option>
                        <option value="Técnico en Electrónica">Técnico en Electrónica</option>
                        <option value="Técnico en Mecánica">Técnico en Mecánica</option>
                        <option value="Técnico en Administración">Técnico en Administración</option>
                      </select>
                      <svg class="absolute right-3 top-3.5 w-5 h-5 text-blue-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                      </svg>
                    </div>
                    <div *ngIf="formulario.get('carrera')?.hasError('required') && formulario.get('carrera')?.touched" 
                         class="mt-2 text-sm text-red-600 flex items-center">
                      <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                      La carrera es requerida
                    </div>
                  </div>
                </div>

                <div *ngIf="tipoUsuario === 'profesor'" class="space-y-6">
                  <div>
                    <label class="block text-sm font-semibold text-blue-700 mb-2">
                      <div class="flex items-center">
                        <svg class="w-4 h-4 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                        </svg>
                        Legajo
                      </div>
                    </label>
                    <input 
                      type="text" 
                      formControlName="legajo" 
                      placeholder="Ej: PROF-54321"
                      class="w-full px-4 py-3 border border-blue-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-all duration-200 shadow-sm bg-blue-50 bg-opacity-50"
                      [class.border-red-500]="formulario.get('legajo')?.invalid && formulario.get('legajo')?.touched"
                      [class.bg-red-50]="formulario.get('legajo')?.invalid && formulario.get('legajo')?.touched">
                    <div *ngIf="formulario.get('legajo')?.hasError('required') && formulario.get('legajo')?.touched" 
                         class="mt-2 text-sm text-red-600 flex items-center">
                      <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                      El legajo es requerido
                    </div>
                    <div *ngIf="formulario.get('legajo')?.hasError('maxlength') && formulario.get('legajo')?.touched" 
                         class="mt-2 text-sm text-red-600 flex items-center">
                      <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                      El legajo no puede exceder los 20 caracteres
                    </div>
                  </div>
                  
                  <div>
                    <label class="block text-sm font-semibold text-blue-700 mb-2">
                      <div class="flex items-center">
                        <svg class="w-4 h-4 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
                        </svg>
                        Especialidad
                      </div>
                    </label>
                    <input 
                      type="text" 
                      formControlName="especialidad" 
                      placeholder="Matemáticas, Programación, etc."
                      class="w-full px-4 py-3 border border-blue-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-all duration-200 shadow-sm bg-blue-50 bg-opacity-50"
                      [class.border-red-500]="formulario.get('especialidad')?.invalid && formulario.get('especialidad')?.touched"
                      [class.bg-red-50]="formulario.get('especialidad')?.invalid && formulario.get('especialidad')?.touched">
                    <div *ngIf="formulario.get('especialidad')?.hasError('required') && formulario.get('especialidad')?.touched" 
                         class="mt-2 text-sm text-red-600 flex items-center">
                      <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                      La especialidad es requerida
                    </div>
                  </div>
                  
                  <div>
                    <label class="block text-sm font-semibold text-blue-700 mb-2">
                      <div class="flex items-center">
                        <svg class="w-4 h-4 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                        </svg>
                        Teléfono
                      </div>
                    </label>
                    <input 
                      type="tel" 
                      formControlName="telefono" 
                      placeholder="+54 11 1234-5678"
                      class="w-full px-4 py-3 border border-blue-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-all duration-200 shadow-sm bg-blue-50 bg-opacity-50">
                  </div>
                </div>

                <div *ngIf="tipoUsuario === 'admin'" class="space-y-6">
                  <div>
                    <label class="block text-sm font-semibold text-blue-700 mb-2">
                      <div class="flex items-center">
                        <svg class="w-4 h-4 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                        </svg>
                        Departamento
                      </div>
                    </label>
                    <div class="relative">
                      <select 
                        formControlName="departamento"
                        class="w-full px-4 py-3 border border-blue-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-all duration-200 shadow-sm bg-blue-50 bg-opacity-50 appearance-none"
                        [class.border-red-500]="formulario.get('departamento')?.invalid && formulario.get('departamento')?.touched"
                        [class.bg-red-50]="formulario.get('departamento')?.invalid && formulario.get('departamento')?.touched">
                        <option value="">Seleccionar departamento</option>
                        <option value="Dirección">Dirección</option>
                        <option value="Secretaría Académica">Secretaría Académica</option>
                        <option value="Administración">Administración</option>
                        <option value="Sistemas">Sistemas</option>
                      </select>
                      <svg class="absolute right-3 top-3.5 w-5 h-5 text-blue-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                      </svg>
                    </div>
                    <div *ngIf="formulario.get('departamento')?.hasError('required') && formulario.get('departamento')?.touched" 
                         class="mt-2 text-sm text-red-600 flex items-center">
                      <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                      El departamento es requerido
                    </div>
                  </div>
                </div>

                <!-- Contraseña -->
                <div>
                  <label class="block text-sm font-semibold text-blue-700 mb-2">
                    <div class="flex items-center">
                      <svg class="w-4 h-4 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                      </svg>
                      Contraseña
                    </div>
                  </label>
                  <input 
                    type="password" 
                    formControlName="password" 
                    placeholder="Mínimo 8 caracteres"
                    class="w-full px-4 py-3 border border-blue-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-all duration-200 shadow-sm bg-blue-50 bg-opacity-50"
                    [class.border-red-500]="formulario.get('password')?.invalid && formulario.get('password')?.touched"
                    [class.bg-red-50]="formulario.get('password')?.invalid && formulario.get('password')?.touched">
                  <div *ngIf="formulario.get('password')?.hasError('required') && formulario.get('password')?.touched" 
                       class="mt-2 text-sm text-red-600 flex items-center">
                    <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    La contraseña es requerida
                  </div>
                  <div *ngIf="formulario.get('password')?.hasError('minlength') && formulario.get('password')?.touched" 
                       class="mt-2 text-sm text-red-600 flex items-center">
                    <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    La contraseña debe tener al menos 8 caracteres
                  </div>
                </div>

                <!-- Confirmar contraseña -->
                <div>
                  <label class="block text-sm font-semibold text-blue-700 mb-2">
                    <div class="flex items-center">
                      <svg class="w-4 h-4 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                      Confirmar contraseña
                    </div>
                  </label>
                  <input 
                    type="password" 
                    formControlName="confirmPassword" 
                    placeholder="Confirma tu contraseña"
                    class="w-full px-4 py-3 border border-blue-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-all duration-200 shadow-sm bg-blue-50 bg-opacity-50"
                    [class.border-red-500]="formulario.get('confirmPassword')?.invalid && formulario.get('confirmPassword')?.touched"
                    [class.bg-red-50]="formulario.get('confirmPassword')?.invalid && formulario.get('confirmPassword')?.touched">
                  <div *ngIf="formulario.get('confirmPassword')?.hasError('required') && formulario.get('confirmPassword')?.touched" 
                       class="mt-2 text-sm text-red-600 flex items-center">
                    <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    Debes confirmar la contraseña
                  </div>
                  <div *ngIf="formulario.hasError('passwordMismatch') && formulario.get('confirmPassword')?.touched" 
                       class="mt-2 text-sm text-red-600 flex items-center">
                    <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    Las contraseñas no coinciden
                  </div>
                </div>

                <!-- Términos y condiciones -->
                <div class="bg-gradient-to-r from-sky-50 to-blue-50 p-6 rounded-2xl border border-blue-100">
                  <div class="flex items-start">
                    <div class="flex items-center h-5 mt-1">
                      <input
                        type="checkbox"
                        formControlName="aceptaTerminos"
                        class="h-5 w-5 text-blue-600 border-blue-300 rounded focus:ring-blue-500 focus:ring-2">
                    </div>
                    <div class="ml-4">
                      <label class="text-sm font-medium text-blue-800 cursor-pointer">
                        <div class="flex items-center">
                          <svg class="w-4 h-4 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                          </svg>
                          Acepto los términos y condiciones de uso
                        </div>
                      </label>
                      <p class="text-xs text-blue-600 mt-1">Al registrarte, aceptas nuestras políticas de privacidad y términos de servicio</p>
                      <div *ngIf="formulario.get('aceptaTerminos')?.hasError('required') && formulario.get('aceptaTerminos')?.touched" 
                           class="mt-2 text-sm text-red-600 flex items-center">
                        <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                        Debes aceptar los términos y condiciones
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Botones del formulario -->
              <div class="mt-8 space-y-4">
                <button 
                  type="submit"
                  [disabled]="formulario.invalid || cargando"
                  class="w-full py-4 px-6 rounded-xl font-semibold text-white transition-all duration-300 transform hover:scale-105 shadow-lg bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 hover:from-blue-700 hover:via-blue-800 hover:to-blue-900 focus:ring-4 focus:ring-blue-300 focus:outline-none"
                  [class.opacity-50]="formulario.invalid || cargando"
                  [class.cursor-not-allowed]="formulario.invalid || cargando"
                  [class.transform-none]="formulario.invalid || cargando"
                  [class.hover:scale-100]="formulario.invalid || cargando">
                  <span *ngIf="!cargando" class="flex items-center justify-center">
                    <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"></path>
                    </svg>
                    Crear cuenta
                  </span>
                  <span *ngIf="cargando" class="flex items-center justify-center">
                    <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creando cuenta...
                  </span>
                </button>
                
                <button 
                  type="button"
                  (click)="limpiarFormulario()"
                  class="w-full py-4 px-6 border-2 border-blue-200 rounded-xl font-semibold text-blue-700 bg-gradient-to-r from-blue-50 to-sky-50 hover:from-blue-100 hover:to-sky-100 hover:border-blue-300 transition-all duration-300 transform hover:scale-105 shadow-sm focus:ring-4 focus:ring-blue-200 focus:outline-none">
                  <span class="flex items-center justify-center">
                    <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                    </svg>
                    Limpiar formulario
                  </span>
                </button>
              </div>
            </form>
          </div>
        </div>

        <!-- Enlaces de ayuda -->
        <div class="mt-6 text-center">
          <p class="text-sm text-gray-600">
            ¿Necesitas ayuda? <a href="#" class="text-blue-600 hover:underline">Contacta con soporte</a>
          </p>
        </div>
      </div>
    </div>
  `
})
export class RegistroUsuarioComponent implements OnInit {
  tipoUsuario: UserRole = 'student';  // Usando el tipo de user.model.ts
  formulario: FormGroup;
  cargando = false;

  private fb = inject(FormBuilder);
  private userService = inject(UserService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  constructor() {
    // Formulario ajustado según la estructura de tabla MySQL
    this.formulario = this.fb.group({
      // Campos obligatorios según la tabla
      name: ['', [Validators.required, Validators.maxLength(255)]],
      email: ['', [Validators.required, Validators.email, Validators.maxLength(255)]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required]],
      
      // Campos opcionales según la estructura de la tabla
      dni: ['', [Validators.maxLength(20)]],
      legajo: ['', [Validators.maxLength(20)]],  // Nuevo campo agregado según la tabla MySQL
      carrera: ['', [Validators.maxLength(100)]],
      especialidad: ['', [Validators.maxLength(100)]],
      telefono: ['', [Validators.maxLength(20)]],
      departamento: [''],  // Enum en MySQL: 'Dirección','Secretaría','Administración','Sistemas'
      
      aceptaTerminos: [false, [Validators.requiredTrue]]
    }, { validators: this.passwordMatchValidator });
  }

  ngOnInit(): void {
    // Obtener tipo de usuario de la URL si existe
    this.route.queryParams.subscribe(params => {
      if (params['tipo'] && ['student', 'profesor', 'admin'].includes(params['tipo'])) {
        this.tipoUsuario = params['tipo'] as UserRole;
        this.configurarValidaciones();
      }
    });
  }

  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    
    if (password !== confirmPassword) {
      form.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }
    
    return null;
  }

  cambiarTipoUsuario(tipo: UserRole): void {
    this.tipoUsuario = tipo;
    this.configurarValidaciones();
    this.formulario.reset({
      aceptaTerminos: false
    });
  }

  configurarValidaciones(): void {
    // Obtener referencias a los controles del formulario
    const dniControl = this.formulario.get('dni');
    const legajoControl = this.formulario.get('legajo'); // Nuevo campo según MySQL
    const carreraControl = this.formulario.get('carrera');
    const especialidadControl = this.formulario.get('especialidad');
    const departamentoControl = this.formulario.get('departamento');
    const telefonoControl = this.formulario.get('telefono');

    // Limpiar validaciones previas
    dniControl?.clearValidators();
    legajoControl?.clearValidators();
    carreraControl?.clearValidators();
    especialidadControl?.clearValidators();
    departamentoControl?.clearValidators();
    telefonoControl?.clearValidators();

    // Mantener validaciones de longitud máxima según MySQL
    dniControl?.setValidators([Validators.maxLength(20)]);
    legajoControl?.setValidators([Validators.maxLength(20)]);
    carreraControl?.setValidators([Validators.maxLength(100)]);
    especialidadControl?.setValidators([Validators.maxLength(100)]);
    telefonoControl?.setValidators([Validators.maxLength(20)]);

    // Aplicar validaciones adicionales según el tipo de usuario
    if (this.tipoUsuario === 'student') {
      dniControl?.addValidators([Validators.required]);
      legajoControl?.addValidators([Validators.required]); // El legajo es obligatorio para estudiantes
      carreraControl?.addValidators([Validators.required]);
    } else if (this.tipoUsuario === 'profesor') {
      legajoControl?.addValidators([Validators.required]); // El legajo también es para profesores
      especialidadControl?.addValidators([Validators.required]);
      telefonoControl?.addValidators([Validators.required]);
    } else if (this.tipoUsuario === 'admin') {
      departamentoControl?.addValidators([Validators.required]);
      // Validador para asegurar que el departamento sea uno de los valores del enum MySQL
      departamentoControl?.addValidators([Validators.pattern('Dirección|Secretaría|Administración|Sistemas')]);
    }

    // Actualizar validaciones
    dniControl?.updateValueAndValidity();
    legajoControl?.updateValueAndValidity();
    carreraControl?.updateValueAndValidity();
    especialidadControl?.updateValueAndValidity();
    departamentoControl?.updateValueAndValidity();
    telefonoControl?.updateValueAndValidity();
  }

  getTitulo(): string {
    const titulos = {
      'student': 'Registro de Estudiante',
      'profesor': 'Registro de Profesor',
      'admin': 'Registro de Administrador'
    };
    return titulos[this.tipoUsuario];
  }

  getDescripcionRol(): string {
    const descripciones = {
      'student': 'Los estudiantes pueden acceder a sus calificaciones, horarios y material de estudio.',
      'profesor': 'Los profesores pueden gestionar sus clases, calificar estudiantes y acceder a herramientas académicas.',
      'admin': 'Los administradores tienen acceso completo al sistema y pueden gestionar usuarios y configuraciones.'
    };
    return descripciones[this.tipoUsuario];
  }

  getPlaceholderNombre(): string {
    const placeholders = {
      'student': 'Juan Pérez',
      'profesor': 'Prof. María González',
      'admin': 'Admin. Carlos López'
    };
    return placeholders[this.tipoUsuario];
  }

  getPlaceholderEmail(): string {
    const placeholders = {
      'student': 'juan.perez@estudiante.ibeltran.com.ar',
      'profesor': 'maria.gonzalez@profesor.ibeltran.com.ar',
      'admin': 'carlos.lopez@admin.ibeltran.com.ar'
    };
    return placeholders[this.tipoUsuario];
  }

  getTextoBoton(): string {
    const textos = {
      'student': 'Registrar Estudiante',
      'profesor': 'Registrar Profesor',
      'admin': 'Registrar Administrador'
    };
    return textos[this.tipoUsuario];
  }

  limpiarFormulario(): void {
    this.formulario.reset({
      aceptaTerminos: false
    });
    this.formulario.markAsUntouched();
    this.formulario.markAsPristine();
  }

  crearUsuario(): void {
    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      return;
    }

    this.cargando = true;
    // Crear objeto de datos según la estructura MySQL
    const datosUsuario: CreateUserRequest = {
      name: this.formulario.get('name')?.value,
      email: this.formulario.get('email')?.value,
      password: this.formulario.get('password')?.value,
      role: this.tipoUsuario,
      
      // Incluir los campos adicionales según la estructura MySQL
      dni: this.formulario.get('dni')?.value || null,
      legajo: this.formulario.get('legajo')?.value || null,
      carrera: this.tipoUsuario === 'student' ? this.formulario.get('carrera')?.value : null,
      especialidad: this.tipoUsuario === 'profesor' ? this.formulario.get('especialidad')?.value : null,
      telefono: this.formulario.get('telefono')?.value || null,
      departamento: this.tipoUsuario === 'admin' ? 
                   this.formulario.get('departamento')?.value as Departamento : undefined
    };

    // Ya no necesitamos datosAdicionales ya que todos los campos están incluidos en el objeto principal
    // según la estructura de la tabla MySQL

    this.userService.crearUsuario(datosUsuario).subscribe({
      next: (usuario) => {
        // Ya no necesitamos procesar datos adicionales
        console.log('Usuario creado:', usuario);
        
        Swal.fire({
          icon: 'success',
          title: '¡Usuario registrado!',
          text: `El ${this.getTitulo().toLowerCase()} ha sido registrado correctamente`,
          confirmButtonText: 'Continuar',
          confirmButtonColor: this.tipoUsuario === 'student' ? '#3B82F6' : 
                             this.tipoUsuario === 'profesor' ? '#10B981' : '#EF4444'
        }).then(() => {
          this.router.navigate(['/administracion/usuarios']);
        });
        this.cargando = false;
      },
      error: (error) => {
        console.error('Error al crear usuario:', error);
        let mensaje = error.error?.error || `No se pudo crear el ${this.tipoUsuario}`;
        
        // Manejo de errores específicos
        if (error.status === 409) {
          mensaje = 'El email ya está registrado. Intenta con otro.';
        }
        
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: mensaje,
          confirmButtonText: 'Entendido'
        });
        this.cargando = false;
      }
    });
  }

  cancelar(): void {
    this.router.navigate(['/administracion/usuarios']);
  }
}
