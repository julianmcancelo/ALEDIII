import { Component, Input, Output, EventEmitter, OnInit, OnChanges, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService, CrearUsuarioRequest } from '../../../nucleo/servicios/user.service';
import { CarrerasService, Carrera } from '../../../nucleo/servicios/carreras.service';
import { UserRole } from '../../../nucleo/modelos/user.model';
import Swal from 'sweetalert2';

// Ahora usamos UserRole del modelo user.model.ts

@Component({
  selector: 'app-modal-crear-usuario',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div *ngIf="mostrar" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" 
         (click)="cerrar()" 
         style="z-index: 9999;">
      <div class="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto" (click)="$event.stopPropagation()">
        <!-- Header -->
        <div class="px-6 py-4 border-b border-gray-200 flex justify-between items-center"
             [ngClass]="{
               'bg-blue-50': tipoUsuario === 'student',
               'bg-green-50': tipoUsuario === 'profesor', 
               'bg-red-50': tipoUsuario === 'admin'
             }">
          <h3 class="text-lg font-semibold text-gray-800">
            <span class="flex items-center">
              <svg class="w-5 h-5 mr-2" [ngClass]="{
                'text-blue-600': tipoUsuario === 'student',
                'text-green-600': tipoUsuario === 'profesor',
                'text-red-600': tipoUsuario === 'admin'
              }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path *ngIf="tipoUsuario === 'student'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 14l9-5-9-5-9 5 9 5z"></path>
                <path *ngIf="tipoUsuario === 'profesor'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                <path *ngIf="tipoUsuario === 'admin'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
              </svg>
              {{ getTituloModal() }}
            </span>
          </h3>
          <button (click)="cerrar()" class="text-gray-400 hover:text-gray-600">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>

        <!-- Body -->
        <div class="p-6">
          <form [formGroup]="formulario" (ngSubmit)="crearUsuario()">
            <!-- Información del tipo de usuario -->
            <div class="mb-6 p-4 rounded-lg" [ngClass]="{
              'bg-blue-50 border border-blue-200': tipoUsuario === 'student',
              'bg-green-50 border border-green-200': tipoUsuario === 'profesor',
              'bg-red-50 border border-red-200': tipoUsuario === 'admin'
            }">
              <p class="text-sm" [ngClass]="{
                'text-blue-700': tipoUsuario === 'student',
                'text-green-700': tipoUsuario === 'profesor',
                'text-red-700': tipoUsuario === 'admin'
              }">
                {{ getDescripcionRol() }}
              </p>
            </div>

            <!-- Campos del formulario -->
            <div class="space-y-4">
              <!-- Nombre -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  {{ tipoUsuario === 'student' ? 'Nombre del Estudiante' : 
                     tipoUsuario === 'profesor' ? 'Nombre del Profesor' : 'Nombre del Administrador' }}
                </label>
                <input 
                  type="text" 
                  formControlName="name" 
                  [placeholder]="getPlaceholderNombre()"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent"
                  [class.focus:ring-blue-500]="tipoUsuario === 'student'"
                  [class.focus:ring-green-500]="tipoUsuario === 'profesor'"
                  [class.focus:ring-red-500]="tipoUsuario === 'admin'"
                  [class.border-red-500]="formulario.get('name')?.invalid && formulario.get('name')?.touched">
                <div *ngIf="formulario.get('name')?.hasError('required') && formulario.get('name')?.touched" 
                     class="mt-1 text-sm text-red-600">
                  El nombre es requerido
                </div>
              </div>

              <!-- Email -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input 
                  type="email" 
                  formControlName="email" 
                  [placeholder]="getPlaceholderEmail()"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent"
                  [class.focus:ring-blue-500]="tipoUsuario === 'student'"
                  [class.focus:ring-green-500]="tipoUsuario === 'profesor'"
                  [class.focus:ring-red-500]="tipoUsuario === 'admin'"
                  [class.border-red-500]="formulario.get('email')?.invalid && formulario.get('email')?.touched">
                <div *ngIf="formulario.get('email')?.hasError('required') && formulario.get('email')?.touched" 
                     class="mt-1 text-sm text-red-600">
                  El email es requerido
                </div>
                <div *ngIf="formulario.get('email')?.hasError('email') && formulario.get('email')?.touched" 
                     class="mt-1 text-sm text-red-600">
                  Ingresa un email válido
                </div>
              </div>

              <!-- Campos específicos por rol -->
              <div *ngIf="tipoUsuario === 'student'" class="space-y-6">
                
                <!-- Sección: Datos Personales -->
                <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 class="text-sm font-semibold text-blue-800 mb-3 flex items-center">
                    <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                    </svg>
                    Datos Personales
                  </h4>
                  
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-2">Apellidos</label>
                      <input 
                        type="text" 
                        formControlName="apellidos" 
                        placeholder="García López"
                        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    </div>
                    
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-2">DNI *</label>
                      <input 
                        type="text" 
                        formControlName="dni" 
                        placeholder="12345678"
                        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        [class.border-red-500]="formulario.get('dni')?.invalid && formulario.get('dni')?.touched">
                    </div>
                    
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-2">Fecha de Nacimiento</label>
                      <input 
                        type="date" 
                        formControlName="fechaNacimiento"
                        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    </div>
                    
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-2">Estado</label>
                      <select 
                        formControlName="estado"
                        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                        <option value="activo">Activo</option>
                        <option value="inactivo">Inactivo</option>
                        <option value="graduado">Graduado</option>
                      </select>
                    </div>
                  </div>
                </div>

                <!-- Sección: Datos Académicos -->
                <div class="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h4 class="text-sm font-semibold text-green-800 mb-3 flex items-center">
                    <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 14l9-5-9-5-9 5 9 5z"></path>
                    </svg>
                    Datos Académicos
                  </h4>
                  
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-2">Legajo *</label>
                      <input 
                        type="text" 
                        formControlName="legajo" 
                        placeholder="EST-2024-001"
                        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent">
                    </div>
                    
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-2">Carrera *</label>
                      <select 
                        formControlName="carrera_id"
                        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent">
                        <option value="">Seleccionar carrera</option>
                        <option *ngFor="let carrera of carreras" [value]="carrera.id">
                          {{carrera.nombre}} ({{carrera.duracion_anios}} años)
                        </option>
                      </select>
                    </div>
                    
                    <div class="md:col-span-2">
                      <label class="block text-sm font-medium text-gray-700 mb-2">Fecha de Inscripción</label>
                      <input 
                        type="date" 
                        formControlName="fechaInscripcion"
                        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent">
                    </div>
                  </div>
                </div>

                <!-- Sección: Dirección -->
                <div class="bg-purple-50 border border-purple-200 rounded-lg p-4">
                  <h4 class="text-sm font-semibold text-purple-800 mb-3 flex items-center">
                    <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                    </svg>
                    Dirección
                  </h4>
                  
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div class="md:col-span-2">
                      <label class="block text-sm font-medium text-gray-700 mb-2">Calle y Número</label>
                      <input 
                        type="text" 
                        formControlName="calle" 
                        placeholder="Av. Mitre 1234"
                        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent">
                    </div>
                    
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-2">Ciudad</label>
                      <input 
                        type="text" 
                        formControlName="ciudad" 
                        placeholder="Avellaneda"
                        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent">
                    </div>
                    
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-2">Provincia</label>
                      <select 
                        formControlName="provincia"
                        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent">
                        <option value="">Seleccionar provincia</option>
                        <option value="Buenos Aires">Buenos Aires</option>
                        <option value="CABA">Ciudad Autónoma de Buenos Aires</option>
                        <option value="Córdoba">Córdoba</option>
                        <option value="Santa Fe">Santa Fe</option>
                        <option value="Mendoza">Mendoza</option>
                      </select>
                    </div>
                    
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-2">Código Postal</label>
                      <input 
                        type="text" 
                        formControlName="codigoPostal" 
                        placeholder="1870"
                        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent">
                    </div>
                  </div>
                </div>

                <!-- Sección: Contacto de Emergencia -->
                <div class="bg-orange-50 border border-orange-200 rounded-lg p-4">
                  <h4 class="text-sm font-semibold text-orange-800 mb-3 flex items-center">
                    <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                    </svg>
                    Contacto de Emergencia
                  </h4>
                  
                  <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-2">Nombre Completo</label>
                      <input 
                        type="text" 
                        formControlName="contacto_emergencia_nombre" 
                        placeholder="María García"
                        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent">
                    </div>
                    
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-2">Teléfono</label>
                      <input 
                        type="tel" 
                        formControlName="contacto_emergencia_telefono" 
                        placeholder="+54 11 1234-5678"
                        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent">
                    </div>
                    
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-2">Parentesco</label>
                      <select 
                        formControlName="contacto_emergencia_parentesco"
                        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent">
                        <option value="">Seleccionar</option>
                        <option value="Madre">Madre</option>
                        <option value="Padre">Padre</option>
                        <option value="Hermano/a">Hermano/a</option>
                        <option value="Abuelo/a">Abuelo/a</option>
                        <option value="Tío/a">Tío/a</option>
                        <option value="Tutor/a">Tutor/a</option>
                        <option value="Otro">Otro</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              <div *ngIf="tipoUsuario === 'profesor'" class="space-y-6">
                
                <!-- Sección: Datos Profesionales -->
                <div class="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h4 class="text-sm font-semibold text-green-800 mb-3 flex items-center">
                    <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                    </svg>
                    Información Profesional
                  </h4>
                  
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-2">Especialidad *</label>
                      <select 
                        formControlName="especialidad"
                        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        [class.border-red-500]="formulario.get('especialidad')?.invalid && formulario.get('especialidad')?.touched">
                        <option value="">Seleccionar especialidad</option>
                        <option value="Programación">Programación</option>
                        <option value="Redes y Sistemas">Redes y Sistemas</option>
                        <option value="Base de Datos">Base de Datos</option>
                        <option value="Desarrollo Web">Desarrollo Web</option>
                        <option value="Electrónica">Electrónica</option>
                        <option value="Matemática">Matemática</option>
                        <option value="Física">Física</option>
                        <option value="Inglés Técnico">Inglés Técnico</option>
                        <option value="Gestión de Proyectos">Gestión de Proyectos</option>
                        <option value="Otra">Otra</option>
                      </select>
                      <div *ngIf="formulario.get('especialidad')?.hasError('required') && formulario.get('especialidad')?.touched" 
                           class="mt-1 text-sm text-red-600">
                        La especialidad es requerida
                      </div>
                    </div>
                    
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-2">Departamento</label>
                      <select 
                        formControlName="departamento"
                        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent">
                        <option value="">Seleccionar departamento</option>
                        <option value="Informática">Informática</option>
                        <option value="Electrónica">Electrónica</option>
                        <option value="Ciencias Básicas">Ciencias Básicas</option>
                        <option value="Humanidades">Humanidades</option>
                        <option value="Gestión">Gestión</option>
                      </select>
                    </div>
                  </div>
                </div>

                <!-- Sección: Contacto -->
                <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 class="text-sm font-semibold text-blue-800 mb-3 flex items-center">
                    <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                    </svg>
                    Datos de Contacto
                  </h4>
                  
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-2">Teléfono *</label>
                      <input 
                        type="tel" 
                        formControlName="telefono" 
                        placeholder="+54 11 1234-5678"
                        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        [class.border-red-500]="formulario.get('telefono')?.invalid && formulario.get('telefono')?.touched">
                      <div *ngIf="formulario.get('telefono')?.hasError('required') && formulario.get('telefono')?.touched" 
                           class="mt-1 text-sm text-red-600">
                        El teléfono es requerido
                      </div>
                      <div *ngIf="formulario.get('telefono')?.hasError('pattern') && formulario.get('telefono')?.touched" 
                           class="mt-1 text-sm text-red-600">
                        Formato de teléfono inválido
                      </div>
                    </div>
                    
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-2">DNI</label>
                      <input 
                        type="text" 
                        formControlName="dni" 
                        placeholder="12345678"
                        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    </div>
                  </div>
                </div>
              </div>

              <div *ngIf="tipoUsuario === 'admin'">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Departamento</label>
                  <select 
                    formControlName="departamento"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent">
                    <option value="">Seleccionar departamento</option>
                    <option value="Dirección">Dirección</option>
                    <option value="Secretaría Académica">Secretaría Académica</option>
                    <option value="Administración">Administración</option>
                    <option value="Sistemas">Sistemas</option>
                  </select>
                </div>
              </div>

              <!-- Contraseña -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Contraseña</label>
                <input 
                  type="password" 
                  formControlName="password" 
                  placeholder="Mínimo 6 caracteres"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent"
                  [class.focus:ring-blue-500]="tipoUsuario === 'student'"
                  [class.focus:ring-green-500]="tipoUsuario === 'profesor'"
                  [class.focus:ring-red-500]="tipoUsuario === 'admin'"
                  [class.border-red-500]="formulario.get('password')?.invalid && formulario.get('password')?.touched">
                <div *ngIf="formulario.get('password')?.hasError('required') && formulario.get('password')?.touched" 
                     class="mt-1 text-sm text-red-600">
                  La contraseña es requerida
                </div>
                <div *ngIf="formulario.get('password')?.hasError('minlength') && formulario.get('password')?.touched" 
                     class="mt-1 text-sm text-red-600">
                  La contraseña debe tener al menos 6 caracteres
                </div>
              </div>
            </div>
          </form>
        </div>

        <!-- Footer -->
        <div class="px-6 py-4 border-t border-gray-200 flex justify-end space-x-3">
          <button 
            type="button"
            (click)="cerrar()"
            class="px-4 py-2 text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors">
            Cancelar
          </button>
          <button 
            type="button"
            (click)="crearUsuario()"
            [disabled]="formulario.invalid || cargando"
            class="px-4 py-2 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            [ngClass]="{
              'bg-blue-500 hover:bg-blue-600': tipoUsuario === 'student',
              'bg-green-500 hover:bg-green-600': tipoUsuario === 'profesor',
              'bg-red-500 hover:bg-red-600': tipoUsuario === 'admin'
            }">
            <span *ngIf="!cargando">{{ getTextoBoton() }}</span>
            <span *ngIf="cargando" class="flex items-center">
              <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Creando...
            </span>
          </button>
        </div>
      </div>
    </div>
  `
})
export class ModalCrearUsuarioComponent implements OnInit, OnChanges {
  @Input() mostrar = false;
  @Input() tipoUsuario: UserRole = 'student';
  @Output() cerrarModal = new EventEmitter<void>();
  @Output() usuarioCreado = new EventEmitter<any>();

  formulario: FormGroup;
  cargando = false;
  carreras: Carrera[] = [];

  private fb = inject(FormBuilder);
  private userService = inject(UserService);
  private carrerasService = inject(CarrerasService);

  constructor() {
    this.formulario = this.fb.group({
      // Datos básicos
      name: ['', [Validators.required]],
      apellidos: [''],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      
      // Datos específicos estudiante
      dni: [''],
      legajo: [''],
      carrera_id: [''],
      fechaNacimiento: [''],
      fechaInscripcion: [''],
      estado: ['activo'],
      
      // Dirección
      calle: [''],
      ciudad: [''],
      provincia: [''],
      codigoPostal: [''],
      
      // Contacto de emergencia
      contacto_emergencia_nombre: [''],
      contacto_emergencia_telefono: [''],
      contacto_emergencia_parentesco: [''],
      
      // Datos profesor/admin
      telefono: [''],
      especialidad: [''],
      departamento: ['']
    });
  }

  ngOnInit(): void {
    // Configurar validaciones específicas por rol
    this.configurarValidaciones();
    // Cargar carreras disponibles
    this.cargarCarreras();
  }

  ngOnChanges(): void {
    if (this.mostrar) {
      this.configurarValidaciones();
      this.formulario.reset();
    }
  }

  configurarValidaciones(): void {
    if (this.tipoUsuario === 'student') {
      // Campos obligatorios para estudiantes
      this.formulario.get('dni')?.setValidators([Validators.required, Validators.pattern(/^\d{7,8}$/)]);
      this.formulario.get('legajo')?.setValidators([Validators.required]);
      this.formulario.get('carrera_id')?.setValidators([Validators.required]);
      this.formulario.get('apellidos')?.setValidators([Validators.required]);
      
      // Validaciones de formato
      this.formulario.get('codigoPostal')?.setValidators([Validators.pattern(/^\d{4}$/)]);
      this.formulario.get('contacto_emergencia_telefono')?.setValidators([Validators.pattern(/^[\+]?[0-9\s\-\(\)]{10,15}$/)]);
      
    } else if (this.tipoUsuario === 'profesor') {
      this.formulario.get('telefono')?.setValidators([Validators.required, Validators.pattern(/^[\+]?[0-9\s\-\(\)]{10,15}$/)]);
      this.formulario.get('especialidad')?.setValidators([Validators.required]);
      
    } else if (this.tipoUsuario === 'admin') {
      this.formulario.get('departamento')?.setValidators([Validators.required]);
    }
    
    // Actualizar validaciones
    this.formulario.updateValueAndValidity();
  }

  getTituloModal(): string {
    const titulos = {
      'student': 'Crear Nuevo Estudiante',
      'profesor': 'Crear Nuevo Profesor',
      'admin': 'Crear Nuevo Administrador'
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
      'student': 'Crear Estudiante',
      'profesor': 'Crear Profesor',
      'admin': 'Crear Administrador'
    };
    return textos[this.tipoUsuario];
  }

  cerrar(): void {
    this.formulario.reset();
    this.cerrarModal.emit();
  }

  crearUsuario(): void {
    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      return;
    }

    this.cargando = true;
    const datosUsuario: CrearUsuarioRequest = {
      name: this.formulario.get('name')?.value,
      apellidos: this.formulario.get('apellidos')?.value || null,
      email: this.formulario.get('email')?.value,
      password: this.formulario.get('password')?.value,
      role: this.tipoUsuario,
      dni: this.formulario.get('dni')?.value || null,
      legajo: this.formulario.get('legajo')?.value || null,
      carrera_id: this.formulario.get('carrera_id')?.value || null,
      fechaNacimiento: this.formulario.get('fechaNacimiento')?.value || null,
      fechaInscripcion: this.formulario.get('fechaInscripcion')?.value || null,
      estado: this.formulario.get('estado')?.value || 'activo',
      calle: this.formulario.get('calle')?.value || null,
      ciudad: this.formulario.get('ciudad')?.value || null,
      provincia: this.formulario.get('provincia')?.value || null,
      codigoPostal: this.formulario.get('codigoPostal')?.value || null,
      contacto_emergencia_nombre: this.formulario.get('contacto_emergencia_nombre')?.value || null,
      contacto_emergencia_telefono: this.formulario.get('contacto_emergencia_telefono')?.value || null,
      contacto_emergencia_parentesco: this.formulario.get('contacto_emergencia_parentesco')?.value || null,
      telefono: this.formulario.get('telefono')?.value || null,
      departamento: this.formulario.get('departamento')?.value || null,
      especialidad: this.formulario.get('especialidad')?.value || null
    };

    this.userService.crearUsuario(datosUsuario).subscribe({
      next: (usuario) => {
        Swal.fire('¡Éxito!', `${this.getTituloModal().replace('Crear Nuevo', '')} creado correctamente`, 'success');
        this.usuarioCreado.emit(usuario);
        this.cerrar();
        this.cargando = false;
      },
      error: (error) => {
        console.error('Error al crear usuario:', error);
        const mensaje = error.error?.error || `No se pudo crear el ${this.tipoUsuario}`;
        Swal.fire('Error', mensaje, 'error');
        this.cargando = false;
      }
    });
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
}
