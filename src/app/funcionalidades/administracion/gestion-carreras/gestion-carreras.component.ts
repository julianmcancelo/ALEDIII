import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CarrerasService, Carrera, CrearCarreraRequest } from '../../../nucleo/servicios/carreras.service';
import Swal from 'sweetalert2';

// Angular Material Imports
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatDividerModule } from '@angular/material/divider';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialogModule } from '@angular/material/dialog';
import { MatBadgeModule } from '@angular/material/badge';
import { MatRippleModule } from '@angular/material/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatMenuModule } from '@angular/material/menu';

@Component({
  selector: 'app-gestion-carreras',
  standalone: true,
  imports: [
    CommonModule, 
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatTableModule,
    MatChipsModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatToolbarModule,
    MatDividerModule,
    MatTooltipModule,
    MatSnackBarModule,
    MatDialogModule,
    MatBadgeModule,
    MatRippleModule,
    MatExpansionModule,
    MatMenuModule
  ],
  template: `
    <div class="wp-admin-wrapper">
      <!-- WordPress-style Header -->
      <div class="wp-header">
        <div class="wp-header-content">
          <div class="wp-header-left">
            <h1 class="wp-title">Gestión de Carreras</h1>
            <p class="wp-subtitle">Administrar carreras académicas del instituto</p>
          </div>
          <div class="wp-header-stats">
            <div class="wp-stat-item">
              <span class="wp-stat-number">{{ carreras.length }}</span>
              <span class="wp-stat-label">Total Carreras</span>
            </div>
            <div class="wp-stat-item">
              <span class="wp-stat-number">{{ getCarrerasActivas() }}</span>
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
              <h3>Resumen de Carreras</h3>
            </div>
            <div class="wp-widget-content">
              <div class="wp-stats-grid">
                <div class="wp-stat-box">
                  <div class="wp-stat-icon">🎓</div>
                  <div class="wp-stat-info">
                    <span class="wp-stat-value">{{ carreras.length }}</span>
                    <span class="wp-stat-text">Total de Carreras</span>
                  </div>
                </div>
                <div class="wp-stat-box">
                  <div class="wp-stat-icon">✅</div>
                  <div class="wp-stat-info">
                    <span class="wp-stat-value">{{ getCarrerasActivas() }}</span>
                    <span class="wp-stat-text">Carreras Activas</span>
                  </div>
                </div>
                <div class="wp-stat-box">
                  <div class="wp-stat-icon">⏸️</div>
                  <div class="wp-stat-info">
                    <span class="wp-stat-value">{{ carreras.length - getCarrerasActivas() }}</span>
                    <span class="wp-stat-text">Carreras Inactivas</span>
                  </div>
                </div>
                <div class="wp-stat-box">
                  <div class="wp-stat-icon">📊</div>
                  <div class="wp-stat-info">
                    <span class="wp-stat-value">{{ getPromedioDuracion() }}</span>
                    <span class="wp-stat-text">Promedio Duración</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- WordPress-style Form -->
        <div class="wp-widget" [ngClass]="{'wp-widget-expanded': mostrarFormulario}">
          <div class="wp-widget-header" (click)="toggleFormulario()">
            <h3>{{ editandoCarrera ? 'Editar Carrera' : 'Nueva Carrera' }}</h3>
            <button type="button" class="wp-toggle-button">
              {{ mostrarFormulario ? '−' : '+' }}
            </button>
          </div>
          <div class="wp-widget-content" *ngIf="mostrarFormulario">
            <form [formGroup]="formulario" (ngSubmit)="guardarCarrera()" class="wp-form">
              <div class="wp-form-row">
                <div class="wp-form-group">
                  <label class="wp-label">Nombre de la Carrera *</label>
                  <input 
                    type="text" 
                    formControlName="nombre" 
                    placeholder="Ej: Técnico Superior en Informática"
                    class="wp-input"
                    [class.wp-input-error]="formulario.get('nombre')?.invalid && formulario.get('nombre')?.touched">
                  <div *ngIf="formulario.get('nombre')?.hasError('required') && formulario.get('nombre')?.touched" 
                       class="wp-error-message">
                    El nombre es requerido
                  </div>
                </div>
                
                <div class="wp-form-group">
                  <label class="wp-label">Duración (años) *</label>
                  <select formControlName="duracion_anios" class="wp-select">
                    <option value="1">1 año</option>
                    <option value="2">2 años</option>
                    <option value="3">3 años</option>
                    <option value="4">4 años</option>
                    <option value="5">5 años</option>
                    <option value="6">6 años</option>
                  </select>
                </div>
              </div>
              
              <div class="wp-form-row">
                <div class="wp-form-group wp-form-group-full">
                  <label class="wp-label">Descripción</label>
                  <textarea 
                    formControlName="descripcion" 
                    rows="3"
                    placeholder="Descripción de la carrera..."
                    class="wp-textarea">
                  </textarea>
                </div>
              </div>
              
              <div class="wp-form-row">
                <div class="wp-form-group">
                  <label class="wp-label">Estado</label>
                  <select formControlName="estado" class="wp-select">
                    <option value="activa">Activa</option>
                    <option value="inactiva">Inactiva</option>
                  </select>
                </div>
              </div>
              
              <div class="wp-form-actions">
                <button 
                  *ngIf="editandoCarrera"
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
                  {{ editandoCarrera ? 'Actualizar' : 'Crear' }} Carrera
                </button>
              </div>
            </form>
          </div>
        </div>

        <!-- WordPress-style Table -->
        <div class="wp-widget">
          <div class="wp-widget-header">
            <h3>Carreras Registradas ({{ carreras.length }})</h3>
          </div>
          <div class="wp-widget-content">
            <div *ngIf="cargandoCarreras" class="wp-loading">
              <div class="wp-spinner"></div>
              <p>Cargando carreras...</p>
            </div>

            <div *ngIf="!cargandoCarreras && carreras.length === 0" class="wp-empty-state">
              <p>No hay carreras registradas</p>
            </div>

            <div *ngIf="!cargandoCarreras && carreras.length > 0" class="wp-table-container">
              <table class="wp-table">
                <thead>
                  <tr>
                    <th><input type="checkbox" class="wp-checkbox"></th>
                    <th>Carrera</th>
                    <th>Duración</th>
                    <th>Estado</th>
                    <th>Descripción</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  <tr *ngFor="let carrera of carreras" class="wp-table-row">
                    <td><input type="checkbox" class="wp-checkbox"></td>
                    <td>
                      <div class="wp-table-title">
                        <strong>{{ carrera.nombre }}</strong>
                        <div class="wp-table-subtitle">{{ carrera.duracion_anios }} años de duración</div>
                      </div>
                    </td>
                    <td>{{ carrera.duracion_anios }} años</td>
                    <td>
                      <span class="wp-badge" 
                            [ngClass]="{
                              'wp-badge-success': carrera.estado === 'activa',
                              'wp-badge-error': carrera.estado === 'inactiva'
                            }">
                        {{ carrera.estado }}
                      </span>
                    </td>
                    <td>
                      <span class="wp-table-description">
                        {{ carrera.descripcion || 'Sin descripción' }}
                      </span>
                    </td>
                    <td>
                      <div class="wp-table-actions">
                        <button 
                          (click)="editarCarrera(carrera)"
                          class="wp-action-button wp-action-edit"
                          title="Editar">
                          Editar
                        </button>
                        <button 
                          (click)="eliminarCarrera(carrera)"
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
        
        .wp-form-row {
          grid-template-columns: 1fr;
        }
        
        .wp-stats-grid {
          grid-template-columns: 1fr;
        }
      }
    </style>
  `
})
export class GestionCarrerasComponent implements OnInit {
  carreras: Carrera[] = [];
  formulario: FormGroup;
  cargandoCarreras = false;
  cargando = false;
  editandoCarrera: Carrera | null = null;
  mostrarFormulario = true;
  
  displayedColumns: string[] = ['nombre', 'duracion', 'estado', 'descripcion', 'acciones'];

  private carrerasService = inject(CarrerasService);
  private fb = inject(FormBuilder);

  constructor() {
    this.formulario = this.fb.group({
      nombre: ['', [Validators.required]],
      descripcion: [''],
      duracion_anios: [3, [Validators.required]],
      estado: ['activa']
    });
  }

  ngOnInit(): void {
    this.cargarCarreras();
  }

  cargarCarreras(): void {
    this.cargandoCarreras = true;
    this.carrerasService.getCarreras().subscribe({
      next: (carreras) => {
        this.carreras = carreras;
        this.cargandoCarreras = false;
      },
      error: (error) => {
        console.error('Error al cargar carreras:', error);
        this.cargandoCarreras = false;
        Swal.fire('Error', 'No se pudieron cargar las carreras', 'error');
      }
    });
  }

  guardarCarrera(): void {
    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      return;
    }

    this.cargando = true;
    const datosCarrera: CrearCarreraRequest = this.formulario.value;

    const operacion = this.editandoCarrera 
      ? this.carrerasService.actualizarCarrera(this.editandoCarrera.id, datosCarrera)
      : this.carrerasService.crearCarrera(datosCarrera);

    operacion.subscribe({
      next: () => {
        const mensaje = this.editandoCarrera ? 'actualizada' : 'creada';
        Swal.fire('¡Éxito!', `Carrera ${mensaje} correctamente`, 'success');
        this.cargarCarreras();
        this.resetFormulario();
        this.cargando = false;
      },
      error: (error) => {
        console.error('Error al guardar carrera:', error);
        const mensaje = error.error?.error || 'No se pudo guardar la carrera';
        Swal.fire('Error', mensaje, 'error');
        this.cargando = false;
      }
    });
  }

  editarCarrera(carrera: Carrera): void {
    this.editandoCarrera = carrera;
    this.formulario.patchValue({
      nombre: carrera.nombre,
      descripcion: carrera.descripcion || '',
      duracion_anios: carrera.duracion_anios,
      estado: carrera.estado
    });
  }

  cancelarEdicion(): void {
    this.editandoCarrera = null;
    this.resetFormulario();
  }

  eliminarCarrera(carrera: Carrera): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: `¿Deseas eliminar la carrera "${carrera.nombre}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.carrerasService.eliminarCarrera(carrera.id).subscribe({
          next: () => {
            Swal.fire('¡Eliminada!', 'Carrera eliminada correctamente', 'success');
            this.cargarCarreras();
          },
          error: (error) => {
            console.error('Error al eliminar carrera:', error);
            const mensaje = error.error?.error || 'No se pudo eliminar la carrera';
            Swal.fire('Error', mensaje, 'error');
          }
        });
      }
    });
  }

  getCarrerasActivas(): number {
    return this.carreras.filter(carrera => carrera.estado === 'activa').length;
  }

  getPromedioDuracion(): number {
    if (this.carreras.length === 0) return 0;
    const suma = this.carreras.reduce((acc, carrera) => acc + Number(carrera.duracion_anios), 0);
    return Math.round((suma / this.carreras.length) * 10) / 10;
  }

  toggleFormulario(): void {
    this.mostrarFormulario = !this.mostrarFormulario;
    if (!this.mostrarFormulario && this.editandoCarrera) {
      this.cancelarEdicion();
    }
  }

  private resetFormulario(): void {
    this.formulario.reset({
      nombre: '',
      descripcion: '',
      duracion_anios: 3,
      estado: 'activa'
    });
  }
}
