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
    <div class="wp-admin-wrapper">
      <!-- WordPress-style Header -->
      <div class="wp-header">
        <div class="wp-header-content">
          <div class="wp-header-left">
            <h1 class="wp-title">Gestión de Materias</h1>
            <p class="wp-subtitle">Administrar el plan de estudios y asignaciones académicas</p>
          </div>
          <div class="wp-header-stats">
            <div class="wp-stat-item">
              <span class="wp-stat-number">{{ materias.length }}</span>
              <span class="wp-stat-label">Total Materias</span>
            </div>
            <div class="wp-stat-item">
              <span class="wp-stat-number">{{ getMateriasActivas() }}</span>
              <span class="wp-stat-label">Activas</span>
            </div>
          </div>
        </div>
      </div>

      <div class="wp-admin-content">
        <!-- WordPress-style Dashboard Widgets -->
        <div class="wp-dashboard-widgets">
          <div class="wp-widget">
            <div class="wp-widget-header">
              <h3>Resumen de Materias</h3>
            </div>
            <div class="wp-widget-content">
              <div class="wp-stats-grid">
                <div class="wp-stat-box">
                  <div class="wp-stat-icon">📚</div>
                  <div class="wp-stat-info">
                    <span class="wp-stat-value">{{ materias.length }}</span>
                    <span class="wp-stat-text">Total de Materias</span>
                  </div>
                </div>
                <div class="wp-stat-box">
                  <div class="wp-stat-icon">✅</div>
                  <div class="wp-stat-info">
                    <span class="wp-stat-value">{{ getMateriasActivas() }}</span>
                    <span class="wp-stat-text">Materias Activas</span>
                  </div>
                </div>
                <div class="wp-stat-box">
                  <div class="wp-stat-icon">⏸️</div>
                  <div class="wp-stat-info">
                    <span class="wp-stat-value">{{ materias.length - getMateriasActivas() }}</span>
                    <span class="wp-stat-text">Materias Inactivas</span>
                  </div>
                </div>
                <div class="wp-stat-box">
                  <div class="wp-stat-icon">👨‍🏫</div>
                  <div class="wp-stat-info">
                    <span class="wp-stat-value">{{ getMateriasConProfesor() }}</span>
                    <span class="wp-stat-text">Con Profesor Asignado</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- WordPress-style Filters -->
        <div class="wp-widget">
          <div class="wp-widget-header">
            <h3>Filtros de Búsqueda</h3>
          </div>
          <div class="wp-widget-content">
            <div class="wp-filters-grid">
              <div class="wp-filter-group">
                <label class="wp-label">Carrera</label>
                <select 
                  [(ngModel)]="filtroCarrera"
                  (ngModelChange)="aplicarFiltros()"
                  class="wp-select">
                  <option value="">Todas las carreras</option>
                  <option *ngFor="let carrera of carreras" [value]="carrera.id">
                    {{ carrera.nombre }}
                  </option>
                </select>
              </div>
              <div class="wp-filter-group">
                <label class="wp-label">Año</label>
                <select 
                  [(ngModel)]="filtroAnio"
                  (ngModelChange)="aplicarFiltros()"
                  class="wp-select">
                  <option value="">Todos los años</option>
                  <option value="1">1er Año</option>
                  <option value="2">2do Año</option>
                  <option value="3">3er Año</option>
                  <option value="4">4to Año</option>
                  <option value="5">5to Año</option>
                  <option value="6">6to Año</option>
                </select>
              </div>
              <div class="wp-filter-group">
                <label class="wp-label">Búsqueda rápida</label>
                <input 
                  type="text" 
                  [(ngModel)]="busquedaTexto"
                  (ngModelChange)="aplicarFiltros()"
                  placeholder="Buscar por nombre o código..."
                  class="wp-input">
              </div>
              <div class="wp-filter-group">
                <label class="wp-label">&nbsp;</label>
                <button 
                  (click)="limpiarFiltros()"
                  class="wp-button wp-button-secondary">
                  Limpiar Filtros
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- WordPress-style Form -->
        <div class="wp-widget" [ngClass]="{'wp-widget-expanded': mostrarFormulario}">
          <div class="wp-widget-header" (click)="toggleFormulario()">
            <h3>{{ editandoMateria ? 'Editar Materia' : 'Nueva Materia' }}</h3>
            <button type="button" class="wp-toggle-button">
              {{ mostrarFormulario ? '−' : '+' }}
            </button>
          </div>
          <div class="wp-widget-content" *ngIf="mostrarFormulario">
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

        <!-- WordPress-style Table -->
        <div class="wp-widget">
          <div class="wp-widget-header">
            <h3>Materias Registradas ({{ materiasFiltradas.length }})</h3>
          </div>
          <div class="wp-widget-content">
            <div *ngIf="cargandoMaterias" class="wp-loading">
              <div class="wp-spinner"></div>
              <p>Cargando materias...</p>
            </div>

            <div *ngIf="!cargandoMaterias && materiasFiltradas.length === 0" class="wp-empty-state">
              <p>No hay materias registradas</p>
            </div>

            <div *ngIf="!cargandoMaterias && materiasFiltradas.length > 0" class="wp-table-container">
              <table class="wp-table">
                <thead>
                  <tr>
                    <th><input type="checkbox" class="wp-checkbox"></th>
                    <th>Materia</th>
                    <th>Carrera</th>
                    <th>Año</th>
                    <th>Profesor</th>
                    <th>Estado</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  <tr *ngFor="let materia of materiasFiltradas" class="wp-table-row">
                    <td><input type="checkbox" class="wp-checkbox"></td>
                    <td>
                      <div class="wp-table-title">
                        <strong>{{ materia.nombre }}</strong>
                        <div class="wp-table-subtitle">{{ materia.codigo }}</div>
                        <div *ngIf="materia.descripcion" class="wp-table-description">
                          {{ materia.descripcion }}
                        </div>
                      </div>
                    </td>
                    <td>{{ materia.carrera_nombre }}</td>
                    <td>{{ materia.anio }}° Año - {{ getCuatrimestreLabel(materia.cuatrimestre) }}</td>
                    <td>
                      <span [ngClass]="{'wp-text-muted': !materia.profesor_nombre}">
                        {{ materia.profesor_nombre || 'Sin asignar' }}
                      </span>
                    </td>
                    <td>
                      <span class="wp-badge" 
                            [ngClass]="{
                              'wp-badge-success': materia.estado === 'activa',
                              'wp-badge-error': materia.estado === 'inactiva'
                            }">
                        {{ materia.estado }}
                      </span>
                    </td>
                    <td>
                      <div class="wp-table-actions">
                        <button 
                          (click)="editarMateria(materia)"
                          class="wp-action-button wp-action-edit"
                          title="Editar">
                          Editar
                        </button>
                        <button 
                          (click)="eliminarMateria(materia)"
                          class="wp-action-button wp-action-delete"
                          title="Eliminar">
                          Eliminar
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
    </div>

    <!-- WordPress-style CSS -->
    <style>
      .wp-admin-wrapper {
        min-height: 100vh;
        background: #f1f1f1;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif;
      }

      .wp-header {
        background: #23282d;
        color: white;
        padding: 0;
        box-shadow: 0 1px 1px rgba(0,0,0,.04);
      }

      .wp-header-content {
        max-width: 1200px;
        margin: 0 auto;
        padding: 15px 20px;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      .wp-header-left h1.wp-title {
        margin: 0;
        font-size: 23px;
        font-weight: 400;
        line-height: 1.3;
      }

      .wp-header-left .wp-subtitle {
        margin: 5px 0 0 0;
        font-size: 13px;
        color: #b4b9be;
      }

      .wp-header-stats {
        display: flex;
        gap: 15px;
      }

      .wp-stat-item {
        text-align: center;
      }

      .wp-stat-number {
        display: block;
        font-size: 18px;
        font-weight: 600;
        color: #0073aa;
      }

      .wp-stat-label {
        display: block;
        font-size: 11px;
        color: #b4b9be;
        text-transform: uppercase;
      }

      .wp-admin-content {
        max-width: 1200px;
        margin: 0 auto;
        padding: 20px;
      }

      .wp-dashboard-widgets {
        margin-bottom: 20px;
      }

      .wp-widget {
        background: white;
        border: 1px solid #c3c4c7;
        box-shadow: 0 1px 1px rgba(0,0,0,.04);
        margin-bottom: 20px;
      }

      .wp-widget-header {
        background: #f6f7f7;
        border-bottom: 1px solid #c3c4c7;
        padding: 12px 15px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        cursor: pointer;
      }

      .wp-widget-header h3 {
        margin: 0;
        font-size: 14px;
        font-weight: 600;
        color: #23282d;
      }

      .wp-toggle-button {
        background: none;
        border: none;
        font-size: 16px;
        color: #646970;
        cursor: pointer;
        padding: 0;
        width: 20px;
        height: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .wp-widget-content {
        padding: 15px;
      }

      .wp-stats-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 15px;
      }

      .wp-stat-box {
        display: flex;
        align-items: center;
        padding: 15px;
        background: #f9f9f9;
        border-left: 4px solid #0073aa;
        border-radius: 3px;
      }

      .wp-stat-icon {
        font-size: 24px;
        margin-right: 15px;
      }

      .wp-stat-value {
        display: block;
        font-size: 24px;
        font-weight: 600;
        color: #23282d;
        line-height: 1;
      }

      .wp-stat-text {
        display: block;
        font-size: 13px;
        color: #646970;
        margin-top: 2px;
      }

      .wp-filters-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 15px;
        align-items: end;
      }

      .wp-filter-group {
        display: flex;
        flex-direction: column;
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
        padding: 6px 8px;
        border: 1px solid #8c8f94;
        border-radius: 3px;
        font-size: 13px;
        line-height: 1.4;
        background: white;
      }

      .wp-input:focus, .wp-select:focus, .wp-textarea:focus {
        border-color: #0073aa;
        box-shadow: 0 0 0 1px #0073aa;
        outline: none;
      }

      .wp-input-error {
        border-color: #d63638;
      }

      .wp-error-message {
        color: #d63638;
        font-size: 12px;
        margin-top: 3px;
      }

      .wp-button {
        display: inline-block;
        text-decoration: none;
        font-size: 13px;
        line-height: 2.15384615;
        min-height: 30px;
        margin: 0;
        padding: 0 10px;
        cursor: pointer;
        border-width: 1px;
        border-style: solid;
        border-radius: 3px;
        white-space: nowrap;
        box-sizing: border-box;
      }

      .wp-button-primary {
        background: #0073aa;
        border-color: #0073aa;
        color: white;
      }

      .wp-button-primary:hover {
        background: #005a87;
        border-color: #005a87;
      }

      .wp-button-secondary {
        background: #f6f7f7;
        border-color: #c3c4c7;
        color: #0073aa;
      }

      .wp-button-secondary:hover {
        background: #f0f0f1;
        border-color: #8c8f94;
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

      .wp-form-actions {
        display: flex;
        gap: 10px;
        justify-content: flex-end;
        margin-top: 20px;
        padding-top: 15px;
        border-top: 1px solid #c3c4c7;
      }

      .wp-spinner {
        display: inline-block;
        width: 16px;
        height: 16px;
        border: 2px solid #f3f3f3;
        border-top: 2px solid #0073aa;
        border-radius: 50%;
        animation: wp-spin 1s linear infinite;
        margin-right: 8px;
      }

      @keyframes wp-spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }

      .wp-loading {
        text-align: center;
        padding: 40px 20px;
        color: #646970;
      }

      .wp-empty-state {
        text-align: center;
        padding: 40px 20px;
        color: #646970;
      }

      .wp-table-container {
        overflow-x: auto;
      }

      .wp-table {
        width: 100%;
        border-collapse: collapse;
        background: white;
      }

      .wp-table th {
        background: #f6f7f7;
        border-bottom: 1px solid #c3c4c7;
        padding: 8px 10px;
        text-align: left;
        font-size: 13px;
        font-weight: 600;
        color: #23282d;
      }

      .wp-table td {
        padding: 10px;
        border-bottom: 1px solid #c3c4c7;
        font-size: 13px;
        vertical-align: top;
      }

      .wp-table-row:hover {
        background: #f6f7f7;
      }

      .wp-table-title strong {
        font-weight: 600;
        color: #0073aa;
      }

      .wp-table-subtitle {
        font-size: 12px;
        color: #646970;
        margin-top: 2px;
      }

      .wp-table-description {
        font-size: 12px;
        color: #646970;
        margin-top: 4px;
        max-width: 200px;
      }

      .wp-checkbox {
        margin: 0;
      }

      .wp-badge {
        display: inline-block;
        padding: 2px 8px;
        font-size: 11px;
        font-weight: 600;
        text-transform: uppercase;
        border-radius: 3px;
      }

      .wp-badge-success {
        background: #00a32a;
        color: white;
      }

      .wp-badge-error {
        background: #d63638;
        color: white;
      }

      .wp-text-muted {
        color: #646970;
      }

      .wp-table-actions {
        display: flex;
        gap: 5px;
      }

      .wp-action-button {
        font-size: 12px;
        padding: 2px 6px;
        border: none;
        border-radius: 3px;
        cursor: pointer;
        text-decoration: none;
      }

      .wp-action-edit {
        background: #0073aa;
        color: white;
      }

      .wp-action-edit:hover {
        background: #005a87;
      }

      .wp-action-delete {
        background: #d63638;
        color: white;
      }

      .wp-action-delete:hover {
        background: #b32d2e;
      }

      /* Responsive */
      @media (max-width: 768px) {
        .wp-header-content {
          flex-direction: column;
          gap: 10px;
          text-align: center;
        }
        
        .wp-header-stats {
          justify-content: center;
        }
        
        .wp-admin-content {
          padding: 15px;
        }
        
        .wp-form-row, .wp-form-row-3 {
          grid-template-columns: 1fr;
        }
        
        .wp-filters-grid {
          grid-template-columns: 1fr;
        }
        
        .wp-stats-grid {
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
      next: () => {
        const mensaje = this.editandoMateria ? 'actualizada' : 'creada';
        Swal.fire('¡Éxito!', `Materia ${mensaje} correctamente`, 'success');
        this.cargarMaterias();
        this.resetFormulario();
        this.cargando = false;
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
