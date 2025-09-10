import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CdkDragDrop, DragDropModule, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';

import { MateriasService, Materia } from '../../../nucleo/servicios/materias.service';
import { UserService, Usuario } from '../../../nucleo/servicios/user.service';
import { AsignacionesService, AsignacionProfesor, AsignacionEstudiante } from '../../../nucleo/servicios/asignaciones.service';
import { CarrerasService, Carrera } from '../../../nucleo/servicios/carreras.service';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-asignacion-materias',
  standalone: true,
  imports: [CommonModule, FormsModule, DragDropModule],
  templateUrl: './asignacion-materias.component.html',
  styleUrls: ['./asignacion-materias.component.css']
})
export class AsignacionMateriasComponent implements OnInit {
  // Servicios
  private materiasService = inject(MateriasService);
  private userService = inject(UserService);
  private asignacionesService = inject(AsignacionesService);
  private carrerasService = inject(CarrerasService);
  private router = inject(Router);

  // Datos
  materias: Materia[] = [];
  profesores: Usuario[] = [];
  estudiantes: Usuario[] = [];
  carreras: Carrera[] = [];

  // Filtros
  carreraSeleccionada = '';
  anioSeleccionado = '';
  materiaSeleccionada: Materia | null = null;

  // Asignaciones actuales
  profesoresAsignados: AsignacionProfesor[] = [];
  estudiantesAsignados: AsignacionEstudiante[] = [];

  // Estados de carga
  cargandoMaterias = false;
  cargandoProfesores = false;
  cargandoEstudiantes = false;
  cargandoAsignaciones = false;

  // Propiedades calculadas para drag & drop
  get profesoresDisponibles(): Usuario[] {
    if (!this.profesores || !this.profesoresAsignados) return this.profesores || [];
    const asignadosIds = this.profesoresAsignados.map(p => p.id);
    return this.profesores.filter(p => !asignadosIds.includes(p.id));
  }

  get estudiantesDisponibles(): Usuario[] {
    if (!this.estudiantes || !this.estudiantesAsignados) return this.estudiantes || [];
    const asignadosIds = this.estudiantesAsignados.map(e => e.id);
    return this.estudiantes.filter(e => !asignadosIds.includes(e.id));
  }

  // Vista activa
  vistaActiva: 'profesores' | 'estudiantes' = 'profesores';

  ngOnInit(): void {
    this.cargarDatos();
  }

  async cargarDatos(): Promise<void> {
    await Promise.all([
      this.cargarCarreras(),
      this.cargarMaterias(),
      this.cargarProfesores(),
      this.cargarEstudiantes()
    ]);
  }

  cargarCarreras(): Promise<void> {
    return new Promise((resolve) => {
      this.carrerasService.getCarreras().subscribe({
        next: (carreras) => {
          this.carreras = carreras;
          resolve();
        },
        error: (error) => {
          console.error('Error al cargar carreras:', error);
          resolve();
        }
      });
    });
  }

  cargarMaterias(): Promise<void> {
    return new Promise((resolve) => {
      this.cargandoMaterias = true;
      this.materiasService.getMaterias().subscribe({
        next: (materias) => {
          this.materias = materias;
          this.cargandoMaterias = false;
          resolve();
        },
        error: (error) => {
          console.error('Error al cargar materias:', error);
          this.cargandoMaterias = false;
          resolve();
        }
      });
    });
  }

  cargarProfesores(): Promise<void> {
    return new Promise((resolve) => {
      this.cargandoProfesores = true;
      this.userService.getUsersByRole('profesor').subscribe({
        next: (profesores) => {
          this.profesores = profesores;
          this.cargandoProfesores = false;
          resolve();
        },
        error: (error) => {
          console.error('Error al cargar profesores:', error);
          this.cargandoProfesores = false;
          resolve();
        }
      });
    });
  }

  cargarEstudiantes(): Promise<void> {
    return new Promise((resolve) => {
      this.cargandoEstudiantes = true;
      this.userService.getUsersByRole('student').subscribe({
        next: (estudiantes) => {
          this.estudiantes = estudiantes;
          this.cargandoEstudiantes = false;
          resolve();
        },
        error: (error) => {
          console.error('Error al cargar estudiantes:', error);
          this.cargandoEstudiantes = false;
          resolve();
        }
      });
    });
  }

  get materiasFiltradas(): Materia[] {
    return this.materias.filter(materia => {
      const cumpleCarrera = !this.carreraSeleccionada || materia.carrera_id === this.carreraSeleccionada;
      const cumpleAnio = !this.anioSeleccionado || materia.anio.toString() === this.anioSeleccionado;
      return cumpleCarrera && cumpleAnio;
    });
  }


  seleccionarMateria(materia: Materia): void {
    this.materiaSeleccionada = materia;
    this.cargarAsignaciones();
  }

  cargarAsignaciones(): void {
    if (!this.materiaSeleccionada) return;

    this.cargandoAsignaciones = true;
    
    Promise.all([
      this.cargarProfesoresAsignados(),
      this.cargarEstudiantesAsignados()
    ]).finally(() => {
      this.cargandoAsignaciones = false;
    });
  }

  cargarProfesoresAsignados(): Promise<void> {
    return new Promise((resolve) => {
      if (!this.materiaSeleccionada) {
        resolve();
        return;
      }

      this.asignacionesService.getProfesoresByMateria(this.materiaSeleccionada.id).subscribe({
        next: (profesores) => {
          this.profesoresAsignados = profesores;
          resolve();
        },
        error: (error) => {
          console.error('Error al cargar profesores asignados:', error);
          this.profesoresAsignados = [];
          resolve();
        }
      });
    });
  }

  cargarEstudiantesAsignados(): Promise<void> {
    return new Promise((resolve) => {
      if (!this.materiaSeleccionada) {
        resolve();
        return;
      }

      this.asignacionesService.getEstudiantesByMateria(this.materiaSeleccionada.id).subscribe({
        next: (estudiantes) => {
          this.estudiantesAsignados = estudiantes;
          resolve();
        },
        error: (error) => {
          console.error('Error al cargar estudiantes asignados:', error);
          this.estudiantesAsignados = [];
          resolve();
        }
      });
    });
  }

  // Drag and Drop para profesores
  onDropProfesor(event: CdkDragDrop<any[]>): void {
    console.log('onDropProfesor ejecutado:', event);
    console.log('Materia seleccionada:', this.materiaSeleccionada);
    console.log('Previous container:', event.previousContainer.id);
    console.log('Current container:', event.container.id);
    
    if (!this.materiaSeleccionada) {
      console.log('No hay materia seleccionada');
      return;
    }

    if (event.previousContainer !== event.container) {
      const profesor = event.previousContainer.data[event.previousIndex];
      console.log('Profesor a asignar:', profesor);
      
      Swal.fire({
        title: 'Tipo de Asignación',
        text: `Selecciona el tipo de asignación para ${profesor.name}`,
        input: 'select',
        inputOptions: {
          'titular': 'Profesor Titular',
          'adjunto': 'Profesor Adjunto',
          'auxiliar': 'Profesor Auxiliar'
        },
        inputValue: 'titular',
        showCancelButton: true,
        confirmButtonText: 'Asignar',
        cancelButtonText: 'Cancelar'
      }).then((result) => {
        if (result.isConfirmed) {
          console.log('Usuario confirmó asignación con tipo:', result.value);
          this.asignarProfesor(profesor.id, result.value);
        } else {
          console.log('Usuario canceló la asignación');
        }
      });
    } else {
      console.log('Mismo contenedor, no se hace nada');
    }
  }

  // Drag and Drop para estudiantes
  onDropEstudiante(event: CdkDragDrop<any[]>): void {
    console.log('onDropEstudiante ejecutado:', event);
    console.log('Materia seleccionada:', this.materiaSeleccionada);
    console.log('Previous container:', event.previousContainer.id);
    console.log('Current container:', event.container.id);
    
    if (!this.materiaSeleccionada) {
      console.log('No hay materia seleccionada');
      return;
    }

    if (event.previousContainer !== event.container) {
      const estudiante = event.previousContainer.data[event.previousIndex];
      console.log('Estudiante a asignar:', estudiante);
      this.asignarEstudiante(estudiante.id);
    } else {
      console.log('Mismo contenedor, no se hace nada');
    }
  }

  asignarProfesor(profesorId: string, tipoAsignacion: string = 'titular'): void {
    if (!this.materiaSeleccionada) return;

    console.log('Asignando profesor:', profesorId, 'a materia:', this.materiaSeleccionada.id, 'tipo:', tipoAsignacion);
    
    this.asignacionesService.asignarProfesor(this.materiaSeleccionada.id, profesorId, tipoAsignacion).subscribe({
      next: (response) => {
        console.log('Profesor asignado exitosamente:', response);
        Swal.fire('¡Éxito!', 'Profesor asignado correctamente', 'success');
        this.cargarProfesoresAsignados();
        this.cargarProfesores(); // Actualizar lista de disponibles
      },
      error: (error) => {
        console.error('Error al asignar profesor:', error);
        const mensaje = error.error?.error || 'Error al asignar profesor';
        Swal.fire('Error', mensaje, 'error');
      }
    });
  }

  asignarEstudiante(estudianteId: string): void {
    if (!this.materiaSeleccionada) return;

    console.log('Asignando estudiante:', estudianteId, 'a materia:', this.materiaSeleccionada.id);
    
    this.asignacionesService.asignarEstudiante(this.materiaSeleccionada.id, estudianteId).subscribe({
      next: (response) => {
        console.log('Estudiante asignado exitosamente:', response);
        Swal.fire('¡Éxito!', 'Estudiante asignado correctamente', 'success');
        this.cargarEstudiantesAsignados();
        this.cargarEstudiantes(); // Actualizar lista de disponibles
      },
      error: (error) => {
        console.error('Error al asignar estudiante:', error);
        const mensaje = error.error?.error || 'Error al asignar estudiante';
        Swal.fire('Error', mensaje, 'error');
      }
    });
  }

  removerProfesor(profesorId: string): void {
    if (!this.materiaSeleccionada) return;

    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Se removerá al profesor de esta materia',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, remover',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed && this.materiaSeleccionada) {
        this.asignacionesService.removerProfesor(this.materiaSeleccionada.id, profesorId).subscribe({
          next: () => {
            Swal.fire('¡Removido!', 'Profesor removido correctamente', 'success');
            this.cargarProfesoresAsignados();
          },
          error: (error) => {
            console.error('Error al remover profesor:', error);
            Swal.fire('Error', 'No se pudo remover el profesor', 'error');
          }
        });
      }
    });
  }

  removerEstudiante(estudianteId: string): void {
    if (!this.materiaSeleccionada) return;

    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Se removerá al estudiante de esta materia',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, remover',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed && this.materiaSeleccionada) {
        this.asignacionesService.removerEstudiante(this.materiaSeleccionada.id, estudianteId).subscribe({
          next: () => {
            Swal.fire('¡Removido!', 'Estudiante removido correctamente', 'success');
            this.cargarEstudiantesAsignados();
          },
          error: (error) => {
            console.error('Error al remover estudiante:', error);
            Swal.fire('Error', 'No se pudo remover el estudiante', 'error');
          }
        });
      }
    });
  }

  asignacionMasiva(): void {
    if (!this.materiaSeleccionada) return;

    const tipoAsignacion = this.vistaActiva;
    const disponibles = tipoAsignacion === 'profesores' ? this.profesoresDisponibles : this.estudiantesDisponibles;

    if (disponibles.length === 0) {
      Swal.fire('Información', `No hay ${tipoAsignacion} disponibles para asignar`, 'info');
      return;
    }

    Swal.fire({
      title: `Asignación Masiva de ${tipoAsignacion.charAt(0).toUpperCase() + tipoAsignacion.slice(1)}`,
      text: `¿Deseas asignar todos los ${tipoAsignacion} disponibles a esta materia?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, asignar todos',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.ejecutarAsignacionMasiva(disponibles, tipoAsignacion);
      }
    });
  }

  private ejecutarAsignacionMasiva(usuarios: Usuario[], tipo: 'profesores' | 'estudiantes'): void {
    if (!this.materiaSeleccionada) return;

    const asignaciones = usuarios.map(usuario => ({
      materia_id: this.materiaSeleccionada!.id,
      [tipo === 'profesores' ? 'profesor_id' : 'estudiante_id']: usuario.id,
      ...(tipo === 'profesores' ? { tipo_asignacion: 'titular' } : { estado: 'inscrito' })
    }));

    const request = { asignaciones };
    const serviceMethod = tipo === 'profesores' 
      ? this.asignacionesService.asignacionMasivaProfesores(request)
      : this.asignacionesService.asignacionMasivaEstudiantes(request);

    serviceMethod.subscribe({
      next: (response) => {
        const mensaje = `Asignación completada: ${response.exitosas} exitosas`;
        const tipoAlert = response.errores.length > 0 ? 'warning' : 'success';
        
        let detalles = '';
        if (response.errores.length > 0) {
          detalles = `\n\nErrores: ${response.errores.join(', ')}`;
        }

        Swal.fire('Asignación Masiva', mensaje + detalles, tipoAlert);
        this.cargarAsignaciones();
      },
      error: (error) => {
        console.error('Error en asignación masiva:', error);
        Swal.fire('Error', 'Error en la asignación masiva', 'error');
      }
    });
  }

  cambiarVista(vista: 'profesores' | 'estudiantes'): void {
    this.vistaActiva = vista;
  }

  getCarreraNombre(carreraId: string): string {
    const carrera = this.carreras.find(c => c.id === carreraId);
    return carrera?.nombre || 'Carrera no encontrada';
  }

  volver(): void {
    this.router.navigate(['/dashboard/administracion']);
  }
}
