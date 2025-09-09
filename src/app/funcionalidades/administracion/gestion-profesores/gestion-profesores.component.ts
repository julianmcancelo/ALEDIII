import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormsModule } from '@angular/forms';
import { ProfesoresService, Profesor } from '../../../nucleo/servicios/profesores.service';
import { UserService, Usuario } from '../../../nucleo/servicios/user.service';
import { ModalCrearUsuarioComponent } from '../../../compartido/modales/modal-crear-usuario/modal-crear-usuario.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-gestion-profesores',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, ModalCrearUsuarioComponent],
  template: `
    <div class="p-6">
      <div class="max-w-7xl mx-auto">
        <!-- Header -->
        <div class="bg-white rounded-lg shadow-lg mb-6">
          <div class="px-6 py-4 border-b border-gray-200">
            <div class="flex justify-between items-center">
              <div>
                <h2 class="text-2xl font-bold text-gray-800">Gestión de Profesores</h2>
                <p class="text-gray-600 mt-1">Administrar profesores del sistema académico</p>
              </div>
              <button 
                (click)="abrirModalCrear()"
                class="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                </svg>
                <span>Nuevo Profesor</span>
              </button>
            </div>
          </div>
        </div>

        <!-- Filtros y búsqueda -->
        <div class="bg-white rounded-lg shadow-lg mb-6">
          <div class="p-6">
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Buscar por nombre</label>
                <input 
                  type="text" 
                  [(ngModel)]="filtroNombre"
                  (input)="aplicarFiltros()"
                  placeholder="Nombre del profesor..."
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500">
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Especialidad</label>
                <select 
                  [(ngModel)]="filtroEspecialidad"
                  (change)="aplicarFiltros()"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500">
                  <option value="">Todas las especialidades</option>
                  <option value="Programación">Programación</option>
                  <option value="Redes y Sistemas">Redes y Sistemas</option>
                  <option value="Base de Datos">Base de Datos</option>
                  <option value="Desarrollo Web">Desarrollo Web</option>
                  <option value="Electrónica">Electrónica</option>
                  <option value="Matemática">Matemática</option>
                  <option value="Física">Física</option>
                  <option value="Inglés Técnico">Inglés Técnico</option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Departamento</label>
                <select 
                  [(ngModel)]="filtroDepartamento"
                  (change)="aplicarFiltros()"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500">
                  <option value="">Todos los departamentos</option>
                  <option value="Informática">Informática</option>
                  <option value="Electrónica">Electrónica</option>
                  <option value="Ciencias Básicas">Ciencias Básicas</option>
                  <option value="Humanidades">Humanidades</option>
                  <option value="Gestión">Gestión</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <!-- Lista de profesores -->
        <div class="bg-white rounded-lg shadow-lg">
          <div class="px-6 py-4 border-b border-gray-200">
            <h3 class="text-lg font-semibold text-gray-800">
              Profesores Registrados ({{ profesoresFiltrados.length }})
            </h3>
          </div>
          
          <div *ngIf="cargando" class="p-8 text-center">
            <div class="inline-flex items-center">
              <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Cargando profesores...
            </div>
          </div>

          <div *ngIf="!cargando && profesoresFiltrados.length === 0" class="p-8 text-center text-gray-500">
            <svg class="w-12 h-12 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
            </svg>
            <p class="text-lg">No se encontraron profesores</p>
            <p class="text-sm">Crea el primer profesor haciendo clic en "Nuevo Profesor"</p>
          </div>

          <div *ngIf="!cargando && profesoresFiltrados.length > 0" class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Profesor</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Especialidad</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Departamento</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contacto</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha Registro</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr *ngFor="let profesor of profesoresFiltrados" class="hover:bg-gray-50">
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex items-center">
                      <div class="flex-shrink-0 h-10 w-10">
                        <div class="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                          <span class="text-sm font-medium text-green-700">{{getInitials(profesor.name)}}</span>
                        </div>
                      </div>
                      <div class="ml-4">
                        <div class="text-sm font-medium text-gray-900">{{profesor.name}}</div>
                        <div class="text-sm text-gray-500">{{profesor.email}}</div>
                      </div>
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      {{profesor.especialidad || 'Sin especialidad'}}
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {{profesor.departamento || 'Sin departamento'}}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {{profesor.telefono || 'Sin teléfono'}}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {{formatDate(profesor.created_at)}}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div class="flex space-x-2">
                      <button 
                        (click)="editarProfesor(profesor)"
                        class="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                        </svg>
                      </button>
                      <button 
                        (click)="verMaterias(profesor)"
                        class="text-green-600 hover:text-green-900 p-1 rounded hover:bg-green-50">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                        </svg>
                      </button>
                      <button 
                        (click)="eliminarProfesor(profesor)"
                        class="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50">
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
        </div>
      </div>
    </div>

    <!-- Modal para crear profesor -->
    <app-modal-crear-usuario
      *ngIf="mostrarModalCrear"
      [tipoUsuario]="'profesor'"
      (cerrarModal)="cerrarModalCrear()"
      (usuarioCreado)="onProfesorCreado($event)">
    </app-modal-crear-usuario>
  `
})
export class GestionProfesoresComponent implements OnInit {
  private profesoresService = inject(ProfesoresService);
  private userService = inject(UserService);

  profesores: Profesor[] = [];
  profesoresFiltrados: Profesor[] = [];
  cargando = false;
  mostrarModalCrear = false;

  // Filtros
  filtroNombre = '';
  filtroEspecialidad = '';
  filtroDepartamento = '';

  ngOnInit() {
    this.cargarProfesores();
  }

  cargarProfesores() {
    this.cargando = true;
    this.profesoresService.getProfesores().subscribe({
      next: (profesores) => {
        this.profesores = profesores;
        this.aplicarFiltros();
        this.cargando = false;
      },
      error: (error) => {
        console.error('Error al cargar profesores:', error);
        this.cargando = false;
        Swal.fire('Error', 'No se pudieron cargar los profesores', 'error');
      }
    });
  }

  aplicarFiltros() {
    this.profesoresFiltrados = this.profesores.filter(profesor => {
      const coincideNombre = !this.filtroNombre || 
        profesor.name.toLowerCase().includes(this.filtroNombre.toLowerCase());
      
      const coincideEspecialidad = !this.filtroEspecialidad || 
        profesor.especialidad === this.filtroEspecialidad;
      
      const coincideDepartamento = !this.filtroDepartamento || 
        profesor.departamento === this.filtroDepartamento;

      return coincideNombre && coincideEspecialidad && coincideDepartamento;
    });
  }

  abrirModalCrear() {
    this.mostrarModalCrear = true;
  }

  cerrarModalCrear() {
    this.mostrarModalCrear = false;
  }

  onProfesorCreado(profesor: Usuario) {
    this.cargarProfesores(); // Recargar la lista
    this.cerrarModalCrear();
    Swal.fire('Éxito', 'Profesor creado correctamente', 'success');
  }

  editarProfesor(profesor: Profesor) {
    // TODO: Implementar modal de edición
    Swal.fire('Info', 'Funcionalidad de edición en desarrollo', 'info');
  }

  verMaterias(profesor: Profesor) {
    this.profesoresService.getMateriasByProfesor(profesor.id).subscribe({
      next: (materias) => {
        if (materias.length === 0) {
          Swal.fire('Info', `${profesor.name} no tiene materias asignadas`, 'info');
        } else {
          const listaMaterias = materias.map(m => `• ${m.nombre} (${m.carrera_nombre})`).join('<br>');
          Swal.fire({
            title: `Materias de ${profesor.name}`,
            html: listaMaterias,
            icon: 'info',
            confirmButtonText: 'Cerrar'
          });
        }
      },
      error: (error) => {
        console.error('Error al cargar materias:', error);
        Swal.fire('Error', 'No se pudieron cargar las materias del profesor', 'error');
      }
    });
  }

  eliminarProfesor(profesor: Profesor) {
    Swal.fire({
      title: '¿Estás seguro?',
      text: `¿Deseas eliminar al profesor ${profesor.name}? Esta acción no se puede deshacer.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.userService.eliminarUsuario(profesor.id).subscribe({
          next: () => {
            this.cargarProfesores(); // Recargar la lista
            Swal.fire('Eliminado', 'Profesor eliminado correctamente', 'success');
          },
          error: (error) => {
            console.error('Error al eliminar profesor:', error);
            Swal.fire('Error', 'No se pudo eliminar el profesor', 'error');
          }
        });
      }
    });
  }

  getInitials(name: string): string {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES');
  }
}
