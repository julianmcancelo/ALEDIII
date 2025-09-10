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
    <div class="p-6">
      <div class="max-w-6xl mx-auto">
        <!-- Header -->
        <div class="bg-white rounded-lg shadow-lg mb-6">
          <div class="px-6 py-4 border-b border-gray-200">
            <h2 class="text-2xl font-bold text-gray-800">Gestión de Usuarios</h2>
            <p class="text-gray-600 mt-1">Administrar usuarios del sistema</p>
          </div>
        </div>

        <!-- Botones para crear usuarios por tipo -->
        <div class="bg-white rounded-lg shadow-lg mb-6">
          <div class="px-6 py-4 border-b border-gray-200">
            <h3 class="text-lg font-semibold text-gray-800">Crear Usuarios por Tipo</h3>
            <p class="text-gray-600 text-sm mt-1">Selecciona el tipo de usuario que deseas crear</p>
          </div>
          
          <div class="p-6">
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <!-- Botón Crear Estudiante -->
              <button 
                (click)="abrirModal('student')"
                class="bg-blue-500 hover:bg-blue-600 text-white p-6 rounded-lg transition-colors flex flex-col items-center group">
                <svg class="w-12 h-12 mb-3 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 14l9-5-9-5-9 5 9 5z"></path>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"></path>
                </svg>
                <span class="font-semibold text-lg">Crear Estudiante</span>
                <span class="text-blue-100 text-sm mt-1">Acceso a calificaciones y material</span>
              </button>

              <!-- Botón Crear Profesor -->
              <button 
                (click)="abrirModal('profesor')"
                class="bg-green-500 hover:bg-green-600 text-white p-6 rounded-lg transition-colors flex flex-col items-center group">
                <svg class="w-12 h-12 mb-3 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                </svg>
                <span class="font-semibold text-lg">Crear Profesor</span>
                <span class="text-green-100 text-sm mt-1">Gestión de clases y calificaciones</span>
              </button>

              <!-- Botón Crear Admin -->
              <button 
                (click)="abrirModal('admin')"
                class="bg-purple-500 hover:bg-purple-600 text-white p-6 rounded-lg transition-colors flex flex-col items-center group">
                <svg class="w-12 h-12 mb-3 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                </svg>
                <span class="font-semibold text-lg">Crear Administrador</span>
                <span class="text-purple-100 text-sm mt-1">Control total del sistema</span>
              </button>
            </div>
          </div>
        </div>

        <!-- Lista de usuarios existentes -->
        <div class="bg-white rounded-lg shadow-lg">
          <div class="px-6 py-4 border-b border-gray-200">
            <h3 class="text-lg font-semibold text-gray-800">Usuarios Registrados</h3>
            <p class="text-gray-600 text-sm mt-1">Lista de todos los usuarios del sistema</p>
          </div>
          
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Usuario</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rol</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha Creación</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr *ngFor="let usuario of usuarios" class="hover:bg-gray-50">
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex items-center">
                      <div class="flex-shrink-0 h-10 w-10">
                        <div class="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                          <span class="text-sm font-medium text-gray-700">{{getInitials(usuario.name)}}</span>
                        </div>
                      </div>
                      <div class="ml-4">
                        <div class="text-sm font-medium text-gray-900">{{usuario.name}}</div>
                        <div class="text-sm text-gray-500" *ngIf="usuario.apellidos">{{usuario.apellidos}}</div>
                      </div>
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{usuario.email}}</td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full"
                          [ngClass]="{
                            'bg-blue-100 text-blue-800': usuario.role === 'student',
                            'bg-green-100 text-green-800': usuario.role === 'profesor',
                            'bg-purple-100 text-purple-800': usuario.role === 'admin'
                          }">
                      {{getRoleLabel(usuario.role)}}
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {{formatDate(usuario.created_at)}}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button (click)="eliminarUsuario(usuario)" 
                            class="text-red-600 hover:text-red-900 ml-2">
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
    this.tipoUsuarioSeleccionado = tipo;
    this.mostrarModal = true;
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
