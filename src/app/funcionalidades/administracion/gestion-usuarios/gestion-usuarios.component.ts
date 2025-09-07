import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UserService } from '../../../nucleo/servicios/user.service';
import { User, UserRole } from '../../../nucleo/modelos/user.model';
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
                class="bg-red-500 hover:bg-red-600 text-white p-6 rounded-lg transition-colors flex flex-col items-center group">
                <svg class="w-12 h-12 mb-3 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                </svg>
                <span class="font-semibold text-lg">Crear Administrador</span>
                <span class="text-red-100 text-sm mt-1">Acceso completo al sistema</span>
              </button>
            </div>
          </div>
        </div>

        <div class="grid grid-cols-1 gap-6">

          <!-- Lista de Usuarios -->
          <div class="bg-white rounded-lg shadow-lg">
            <div class="px-6 py-4 border-b border-gray-200">
              <h3 class="text-lg font-semibold text-gray-800">Usuarios del Sistema</h3>
            </div>
            
            <div class="p-6">
              <div *ngIf="cargandoUsuarios" class="text-center py-8">
                <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                <p class="mt-2 text-gray-600">Cargando usuarios...</p>
              </div>

              <div *ngIf="!cargandoUsuarios && usuarios.length === 0" class="text-center py-8 text-gray-500">
                No hay usuarios registrados
              </div>

              <div *ngIf="!cargandoUsuarios && usuarios.length > 0" class="space-y-3">
                <div *ngFor="let usuario of usuarios" class="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <div class="flex justify-between items-start">
                    <div class="flex-1">
                      <h4 class="font-semibold text-gray-800">{{ usuario.name }}</h4>
                      <p class="text-sm text-gray-600">{{ usuario.email }}</p>
                      <div class="mt-2">
                        <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                              [ngClass]="{
                                'bg-red-100 text-red-800': usuario.role === 'admin',
                                'bg-blue-100 text-blue-800': usuario.role === 'profesor',
                                'bg-green-100 text-green-800': usuario.role === 'student'
                              }">
                          {{ getRoleLabel(usuario.role) }}
                        </span>
                      </div>
                      <p *ngIf="usuario.created_at" class="text-xs text-gray-500 mt-1">
                        Creado: {{ formatDate(usuario.created_at) }}
                      </p>
                    </div>
                    
                    <button 
                      *ngIf="usuario.id !== currentUser?.id"
                      (click)="eliminarUsuario(usuario)"
                      class="ml-4 text-red-600 hover:text-red-800 transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal para crear usuarios -->
    <app-modal-crear-usuario
      [mostrar]="mostrarModal"
      [tipoUsuario]="tipoUsuarioSeleccionado"
      (cerrarModal)="cerrarModal()"
      (usuarioCreado)="onUsuarioCreado($event)">
    </app-modal-crear-usuario>
  `
})
export class GestionUsuariosComponent implements OnInit {
  usuarios: User[] = [];
  cargandoUsuarios = false;
  currentUser: any = null;
  
  // Variables para el modal
  mostrarModal = false;
  tipoUsuarioSeleccionado: UserRole = 'student';

  private userService = inject(UserService);
  private authService = inject(AuthService);

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    this.cargarUsuarios();
  }

  constructor() {}

  cargarUsuarios(): void {
    this.cargandoUsuarios = true;
    this.userService.getUsuarios().subscribe({
      next: (usuarios) => {
        this.usuarios = usuarios;
        this.cargandoUsuarios = false;
      },
      error: (error) => {
        console.error('Error al cargar usuarios:', error);
        this.cargandoUsuarios = false;
        Swal.fire('Error', 'No se pudieron cargar los usuarios', 'error');
      }
    });
  }

  abrirModal(tipo: UserRole): void {
    console.log('Abriendo modal para tipo:', tipo); // Debug
    this.tipoUsuarioSeleccionado = tipo;
    this.mostrarModal = true;
    console.log('Estado del modal:', this.mostrarModal); // Debug
  }

  cerrarModal(): void {
    this.mostrarModal = false;
  }

  onUsuarioCreado(usuario: any): void {
    this.cargarUsuarios(); // Recargar la lista de usuarios
  }

  eliminarUsuario(usuario: User): void {
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
            Swal.fire('¡Eliminado!', 'Usuario eliminado correctamente', 'success');
            this.cargarUsuarios();
          },
          error: (error) => {
            console.error('Error al eliminar usuario:', error);
            Swal.fire('Error', 'No se pudo eliminar el usuario', 'error');
          }
        });
      }
    });
  }

  getRoleLabel(role: string): string {
    const roles = {
      'admin': 'Administrador',
      'profesor': 'Profesor',
      'student': 'Estudiante'
    };
    return roles[role as keyof typeof roles] || role;
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('es-AR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }
}
