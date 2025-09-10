import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { UserService, Usuario, CrearUsuarioRequest } from '../../../nucleo/servicios/user.service';
import { UserRole } from '../../../nucleo/modelos/user.model';
import { AuthService } from '../../../nucleo/servicios/auth.service';
import { ModalCrearUsuarioComponent } from '../../../compartido/modales/modal-crear-usuario/modal-crear-usuario.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-gestion-usuarios',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ModalCrearUsuarioComponent],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-sky-50 via-blue-50 to-indigo-50 p-6">
      <div class="max-w-6xl mx-auto">
        <!-- Header -->
        <div class="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl mb-8 border border-blue-100">
          <div class="bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 text-white px-8 py-6 rounded-t-2xl">
            <div class="flex items-center">
              <svg class="w-8 h-8 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"></path>
              </svg>
              <div>
                <h2 class="text-3xl font-bold">Gestión de Usuarios</h2>
                <p class="text-blue-100 mt-1">Administrar usuarios del sistema académico</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Botones para crear usuarios por tipo -->
        <div class="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl mb-8 border border-blue-100">
          <div class="bg-gradient-to-r from-sky-100 to-blue-100 px-8 py-6 rounded-t-2xl border-b border-blue-200">
            <h3 class="text-xl font-bold text-blue-800 flex items-center">
              <svg class="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"></path>
              </svg>
              Crear Usuarios por Tipo
            </h3>
            <p class="text-blue-600 text-sm mt-1">Selecciona el tipo de usuario que deseas crear</p>
          </div>
          
          <div class="p-8">
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
              <!-- Botón Crear Estudiante -->
              <button 
                (click)="abrirModal('student')"
                class="bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700 hover:from-blue-600 hover:via-blue-700 hover:to-blue-800 text-white p-8 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex flex-col items-center group border border-blue-400">
                <svg class="w-14 h-14 mb-4 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 14l9-5-9-5-9 5 9 5z"></path>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"></path>
                </svg>
                <span class="font-bold text-xl mb-2">Crear Estudiante</span>
                <span class="text-blue-100 text-sm text-center leading-relaxed">Acceso a calificaciones y material académico</span>
              </button>

              <!-- Botón Crear Profesor -->
              <button 
                (click)="abrirModal('profesor')"
                class="bg-gradient-to-br from-sky-500 via-sky-600 to-blue-600 hover:from-sky-600 hover:via-sky-700 hover:to-blue-700 text-white p-8 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex flex-col items-center group border border-sky-400">
                <svg class="w-14 h-14 mb-4 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                </svg>
                <span class="font-bold text-xl mb-2">Crear Profesor</span>
                <span class="text-sky-100 text-sm text-center leading-relaxed">Gestión de clases y calificaciones</span>
              </button>

              <!-- Botón Crear Admin -->
              <button 
                (click)="abrirModal('admin')"
                class="bg-gradient-to-br from-indigo-500 via-blue-600 to-blue-700 hover:from-indigo-600 hover:via-blue-700 hover:to-blue-800 text-white p-8 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex flex-col items-center group border border-indigo-400">
                <svg class="w-14 h-14 mb-4 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                </svg>
                <span class="font-bold text-xl mb-2">Crear Administrador</span>
                <span class="text-indigo-100 text-sm text-center leading-relaxed">Control total del sistema</span>
              </button>
            </div>
          </div>
        </div>

        <!-- Lista de usuarios existentes -->
        <div class="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-blue-100">
          <div class="bg-gradient-to-r from-sky-100 to-blue-100 px-8 py-6 rounded-t-2xl border-b border-blue-200">
            <h3 class="text-xl font-bold text-blue-800 flex items-center">
              <svg class="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
              </svg>
              Usuarios Registrados
            </h3>
            <p class="text-blue-600 text-sm mt-1">Lista de todos los usuarios del sistema</p>
          </div>
          
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-blue-200">
              <thead class="bg-gradient-to-r from-blue-50 to-sky-50">
                <tr>
                  <th class="px-6 py-4 text-left text-xs font-bold text-blue-700 uppercase tracking-wider">
                    <div class="flex items-center">
                      <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                      </svg>
                      Usuario
                    </div>
                  </th>
                  <th class="px-6 py-4 text-left text-xs font-bold text-blue-700 uppercase tracking-wider">
                    <div class="flex items-center">
                      <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                      </svg>
                      Email
                    </div>
                  </th>
                  <th class="px-6 py-4 text-left text-xs font-bold text-blue-700 uppercase tracking-wider">
                    <div class="flex items-center">
                      <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"></path>
                      </svg>
                      Rol
                    </div>
                  </th>
                  <th class="px-6 py-4 text-left text-xs font-bold text-blue-700 uppercase tracking-wider">
                    <div class="flex items-center">
                      <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3a4 4 0 118 0v4m-4 6v6m-4-6h8a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2v-6a2 2 0 012-2z"></path>
                      </svg>
                      Fecha Creación
                    </div>
                  </th>
                  <th class="px-6 py-4 text-left text-xs font-bold text-blue-700 uppercase tracking-wider">
                    <div class="flex items-center">
                      <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"></path>
                      </svg>
                      Acciones
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-blue-100">
                <tr *ngFor="let usuario of usuarios" class="hover:bg-gradient-to-r hover:from-blue-50 hover:to-sky-50 transition-all duration-200">
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex items-center">
                      <div class="flex-shrink-0 h-12 w-12">
                        <div class="h-12 w-12 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center shadow-lg">
                          <span class="text-sm font-bold text-white">{{getInitials(usuario.name)}}</span>
                        </div>
                      </div>
                      <div class="ml-4">
                        <div class="text-sm font-semibold text-blue-900">{{usuario.name}}</div>
                        <div class="text-sm text-blue-600" *ngIf="usuario.apellidos">{{usuario.apellidos}}</div>
                      </div>
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-blue-800 font-medium">{{usuario.email}}</td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span class="inline-flex px-3 py-1 text-xs font-bold rounded-full bg-gradient-to-r from-blue-100 to-sky-100 text-blue-800 border border-blue-200">
                      {{getRoleLabel(usuario.role)}}
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-blue-600 font-medium">
                    {{formatDate(usuario.created_at)}}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button (click)="eliminarUsuario(usuario)" 
                            class="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-4 py-2 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-lg flex items-center">
                      <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                      </svg>
                      Eliminar
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal para crear usuario -->
    <app-modal-crear-usuario
      *ngIf="mostrarModal"
      [mostrar]="mostrarModal"
      [tipoUsuario]="tipoUsuarioSeleccionado"
      (cerrarModal)="cerrarModal()"
      (usuarioCreado)="onUsuarioCreado($event)">
    </app-modal-crear-usuario>
  `
})
export class GestionUsuariosComponent implements OnInit {
  private userService = inject(UserService);
  private authService = inject(AuthService);

  usuarios: Usuario[] = [];
  mostrarModal = false;
  tipoUsuarioSeleccionado: UserRole = 'student';

  ngOnInit() {
    this.cargarUsuarios();
  }

  cargarUsuarios() {
    this.userService.getUsuarios().subscribe({
      next: (usuarios) => {
        this.usuarios = usuarios;
      },
      error: (error) => {
        console.error('Error al cargar usuarios:', error);
        Swal.fire('Error', 'No se pudieron cargar los usuarios', 'error');
      }
    });
  }

  abrirModal(tipo: UserRole) {
    console.log('Abriendo modal para tipo:', tipo);
    this.tipoUsuarioSeleccionado = tipo;
    this.mostrarModal = true;
    console.log('Modal mostrar:', this.mostrarModal);
  }

  cerrarModal() {
    this.mostrarModal = false;
  }

  onUsuarioCreado(usuario: Usuario) {
    this.usuarios.push(usuario);
    this.cerrarModal();
    Swal.fire('Éxito', 'Usuario creado correctamente', 'success');
  }

  eliminarUsuario(usuario: Usuario) {
    Swal.fire({
      title: '¿Estás seguro?',
      text: `¿Deseas eliminar al usuario ${usuario.name}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.userService.eliminarUsuario(usuario.id).subscribe({
          next: () => {
            this.usuarios = this.usuarios.filter(u => u.id !== usuario.id);
            Swal.fire('Eliminado', 'Usuario eliminado correctamente', 'success');
          },
          error: (error) => {
            console.error('Error al eliminar usuario:', error);
            Swal.fire('Error', 'No se pudo eliminar el usuario', 'error');
          }
        });
      }
    });
  }

  getInitials(name: string): string {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  }

  getRoleLabel(role: string): string {
    const labels: { [key: string]: string } = {
      'student': 'Estudiante',
      'profesor': 'Profesor',
      'admin': 'Administrador'
    };
    return labels[role] || role;
  }

  formatDate(dateString?: string): string {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('es-ES');
  }
}
