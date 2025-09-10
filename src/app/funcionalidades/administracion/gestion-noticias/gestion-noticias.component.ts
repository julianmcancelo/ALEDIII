import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

// Angular Material Imports
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatMenuModule } from '@angular/material/menu';

import { NoticiasService, Noticia } from '../../../nucleo/servicios/noticias.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-gestion-noticias',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatSnackBarModule,
    MatChipsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    MatMenuModule
  ],
  template: `
    <div class="gestion-noticias-container">
      <!-- Header -->
      <mat-card class="header-card">
        <mat-card-header>
          <mat-card-title class="flex items-center gap-3">
            <mat-icon color="primary" class="text-3xl">article</mat-icon>
            <span>Gestión de Noticias</span>
          </mat-card-title>
          <mat-card-subtitle>
            Administra las noticias que se muestran en la página principal
          </mat-card-subtitle>
        </mat-card-header>
        <mat-card-actions align="end">
          <button mat-raised-button color="primary" (click)="abrirDialogoNoticia()">
            <mat-icon>add</mat-icon>
            Nueva Noticia
          </button>
        </mat-card-actions>
      </mat-card>

      <!-- Loading -->
      <div *ngIf="cargando" class="flex justify-center items-center py-20">
        <mat-spinner diameter="50"></mat-spinner>
        <span class="ml-4 text-lg">Cargando noticias...</span>
      </div>

      <!-- Lista de Noticias -->
      <mat-card *ngIf="!cargando" class="noticias-card">
        <mat-card-content>
          <div *ngIf="noticias.length === 0" class="text-center py-20">
            <mat-icon class="text-6xl text-gray-400 mb-4">article</mat-icon>
            <h3 class="text-xl font-semibold text-gray-600 mb-2">No hay noticias</h3>
            <p class="text-gray-500 mb-4">Comienza creando tu primera noticia</p>
            <button mat-raised-button color="primary" (click)="abrirDialogoNoticia()">
              <mat-icon>add</mat-icon>
              Crear Primera Noticia
            </button>
          </div>

          <div *ngIf="noticias.length > 0" class="grid gap-6">
            <mat-card *ngFor="let noticia of noticias" class="noticia-item">
              <div class="flex">
                <!-- Imagen -->
                <div class="w-32 h-24 flex-shrink-0">
                  <img 
                    [src]="noticia.imagen_url || 'assets/images/home/default-news.jpg'"
                    [alt]="noticia.titulo"
                    class="w-full h-full object-cover rounded"
                    (error)="onImageError($event)">
                </div>

                <!-- Contenido -->
                <div class="flex-1 ml-4">
                  <div class="flex justify-between items-start mb-2">
                    <h3 class="text-lg font-semibold text-gray-900 line-clamp-2">
                      {{ noticia.titulo }}
                    </h3>
                    <button mat-icon-button [matMenuTriggerFor]="menuAcciones">
                      <mat-icon>more_vert</mat-icon>
                    </button>
                    
                    <mat-menu #menuAcciones="matMenu">
                      <button mat-menu-item (click)="editarNoticia(noticia)">
                        <mat-icon>edit</mat-icon>
                        <span>Editar</span>
                      </button>
                      <button mat-menu-item (click)="cambiarEstado(noticia)">
                        <mat-icon>{{ noticia.estado === 'publicada' ? 'visibility_off' : 'visibility' }}</mat-icon>
                        <span>{{ noticia.estado === 'publicada' ? 'Despublicar' : 'Publicar' }}</span>
                      </button>
                      <button mat-menu-item (click)="eliminarNoticia(noticia)" class="text-red-600">
                        <mat-icon>delete</mat-icon>
                        <span>Eliminar</span>
                      </button>
                    </mat-menu>
                  </div>

                  <p class="text-gray-600 text-sm mb-3 line-clamp-2">
                    {{ noticia.resumen }}
                  </p>

                  <div class="flex items-center justify-between">
                    <div class="flex items-center gap-2">
                      <mat-chip [color]="obtenerColorEstado(noticia.estado)" class="text-xs">
                        {{ obtenerTextoEstado(noticia.estado) }}
                      </mat-chip>
                      <mat-chip color="accent" class="text-xs">
                        {{ noticia.categoria }}
                      </mat-chip>
                    </div>
                    
                    <div class="text-xs text-gray-500">
                      <div>{{ formatearFecha(noticia.fecha_publicacion) }}</div>
                      <div>Por: {{ noticia.autor }}</div>
                    </div>
                  </div>
                </div>
              </div>
            </mat-card>
          </div>
        </mat-card-content>
      </mat-card>

      <!-- Formulario Modal -->
      <div *ngIf="mostrarFormulario" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <mat-card class="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          <mat-card-header>
            <mat-card-title>
              {{ noticiaEditando ? 'Editar Noticia' : 'Nueva Noticia' }}
            </mat-card-title>
          </mat-card-header>
          
          <mat-card-content>
            <form [formGroup]="formularioNoticia" class="space-y-4">
              <mat-form-field appearance="outline" class="w-full">
                <mat-label>Título</mat-label>
                <input matInput formControlName="titulo" placeholder="Título de la noticia">
                <mat-error *ngIf="formularioNoticia.get('titulo')?.hasError('required')">
                  El título es obligatorio
                </mat-error>
              </mat-form-field>

              <mat-form-field appearance="outline" class="w-full">
                <mat-label>Resumen</mat-label>
                <textarea matInput formControlName="resumen" rows="3" 
                         placeholder="Resumen breve de la noticia"></textarea>
                <mat-error *ngIf="formularioNoticia.get('resumen')?.hasError('required')">
                  El resumen es obligatorio
                </mat-error>
              </mat-form-field>

              <mat-form-field appearance="outline" class="w-full">
                <mat-label>Contenido</mat-label>
                <textarea matInput formControlName="contenido" rows="8" 
                         placeholder="Contenido completo de la noticia"></textarea>
                <mat-error *ngIf="formularioNoticia.get('contenido')?.hasError('required')">
                  El contenido es obligatorio
                </mat-error>
              </mat-form-field>

              <mat-form-field appearance="outline" class="w-full">
                <mat-label>URL de Imagen</mat-label>
                <input matInput formControlName="imagen_url" 
                       placeholder="https://ejemplo.com/imagen.jpg">
              </mat-form-field>

              <div class="grid grid-cols-2 gap-4">
                <mat-form-field appearance="outline">
                  <mat-label>Categoría</mat-label>
                  <mat-select formControlName="categoria">
                    <mat-option *ngFor="let categoria of categorias" [value]="categoria">
                      {{ categoria | titlecase }}
                    </mat-option>
                  </mat-select>
                </mat-form-field>

                <mat-form-field appearance="outline">
                  <mat-label>Estado</mat-label>
                  <mat-select formControlName="estado">
                    <mat-option value="borrador">Borrador</mat-option>
                    <mat-option value="publicada">Publicada</mat-option>
                    <mat-option value="archivada">Archivada</mat-option>
                  </mat-select>
                </mat-form-field>
              </div>

              <div class="grid grid-cols-2 gap-4">
                <mat-form-field appearance="outline">
                  <mat-label>Fecha de Publicación</mat-label>
                  <input matInput [matDatepicker]="picker" formControlName="fecha_publicacion">
                  <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
                  <mat-datepicker #picker></mat-datepicker>
                </mat-form-field>

                <mat-form-field appearance="outline">
                  <mat-label>Autor</mat-label>
                  <input matInput formControlName="autor" placeholder="Nombre del autor">
                </mat-form-field>
              </div>
            </form>
          </mat-card-content>

          <mat-card-actions align="end" class="gap-2">
            <button mat-button (click)="cerrarFormulario()">Cancelar</button>
            <button mat-raised-button color="primary" 
                    [disabled]="formularioNoticia.invalid || guardando"
                    (click)="guardarNoticia()">
              <mat-spinner *ngIf="guardando" diameter="20" class="mr-2"></mat-spinner>
              {{ noticiaEditando ? 'Actualizar' : 'Crear' }}
            </button>
          </mat-card-actions>
        </mat-card>
      </div>
    </div>
  `,
  styles: [`
    .gestion-noticias-container {
      padding: 24px;
      max-width: 1200px;
      margin: 0 auto;
    }

    .header-card {
      margin-bottom: 24px;
    }

    .noticias-card {
      margin-bottom: 24px;
    }

    .noticia-item {
      transition: all 0.2s ease;
    }

    .noticia-item:hover {
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }

    .line-clamp-2 {
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .fixed {
      position: fixed;
    }

    .inset-0 {
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
    }

    .z-50 {
      z-index: 50;
    }
  `]
})
export class GestionNoticiasComponent implements OnInit {
  private noticiasService = inject(NoticiasService);
  private fb = inject(FormBuilder);
  private snackBar = inject(MatSnackBar);
  private router = inject(Router);

  noticias: Noticia[] = [];
  cargando = false;
  guardando = false;
  mostrarFormulario = false;
  noticiaEditando: Noticia | null = null;

  categorias: string[] = [];
  formularioNoticia: FormGroup;

  constructor() {
    this.formularioNoticia = this.fb.group({
      titulo: ['', [Validators.required, Validators.maxLength(255)]],
      resumen: ['', [Validators.required, Validators.maxLength(500)]],
      contenido: ['', Validators.required],
      imagen_url: [''],
      categoria: ['general', Validators.required],
      estado: ['borrador', Validators.required],
      fecha_publicacion: [new Date(), Validators.required],
      autor: ['Administrador', Validators.required]
    });
  }

  ngOnInit(): void {
    this.categorias = this.noticiasService.obtenerCategorias();
    this.cargarNoticias();
  }

  cargarNoticias(): void {
    this.cargando = true;
    this.noticiasService.obtenerNoticiasAdmin().subscribe({
      next: (response) => {
        if (response.success) {
          this.noticias = response.data;
        }
        this.cargando = false;
      },
      error: (error) => {
        console.error('Error al cargar noticias:', error);
        this.cargando = false;
        this.snackBar.open('Error al cargar las noticias', 'Cerrar', {
          duration: 3000,
          panelClass: ['error-snackbar']
        });
      }
    });
  }

  abrirDialogoNoticia(): void {
    this.noticiaEditando = null;
    this.formularioNoticia.reset({
      categoria: 'general',
      estado: 'borrador',
      fecha_publicacion: new Date(),
      autor: 'Administrador'
    });
    this.mostrarFormulario = true;
  }

  editarNoticia(noticia: Noticia): void {
    this.noticiaEditando = noticia;
    this.formularioNoticia.patchValue({
      titulo: noticia.titulo,
      resumen: noticia.resumen,
      contenido: noticia.contenido,
      imagen_url: noticia.imagen_url,
      categoria: noticia.categoria,
      estado: noticia.estado,
      fecha_publicacion: new Date(noticia.fecha_publicacion),
      autor: noticia.autor
    });
    this.mostrarFormulario = true;
  }

  cerrarFormulario(): void {
    this.mostrarFormulario = false;
    this.noticiaEditando = null;
  }

  guardarNoticia(): void {
    if (this.formularioNoticia.invalid) return;

    this.guardando = true;
    const datosNoticia = {
      ...this.formularioNoticia.value,
      fecha_publicacion: this.formularioNoticia.value.fecha_publicacion.toISOString()
    };

    const operacion = this.noticiaEditando
      ? this.noticiasService.actualizarNoticia(this.noticiaEditando.id!, datosNoticia)
      : this.noticiasService.crearNoticia(datosNoticia);

    operacion.subscribe({
      next: (response) => {
        if (response.success) {
          this.snackBar.open(
            this.noticiaEditando ? 'Noticia actualizada' : 'Noticia creada',
            'Cerrar',
            { duration: 3000, panelClass: ['success-snackbar'] }
          );
          this.cerrarFormulario();
          this.cargarNoticias();
        }
        this.guardando = false;
      },
      error: (error) => {
        console.error('Error al guardar noticia:', error);
        this.guardando = false;
        this.snackBar.open('Error al guardar la noticia', 'Cerrar', {
          duration: 3000,
          panelClass: ['error-snackbar']
        });
      }
    });
  }

  cambiarEstado(noticia: Noticia): void {
    const nuevoEstado = noticia.estado === 'publicada' ? 'borrador' : 'publicada';
    
    this.noticiasService.cambiarEstadoNoticia(noticia.id!, nuevoEstado).subscribe({
      next: (response) => {
        if (response.success) {
          this.snackBar.open(
            `Noticia ${nuevoEstado === 'publicada' ? 'publicada' : 'despublicada'}`,
            'Cerrar',
            { duration: 3000 }
          );
          this.cargarNoticias();
        }
      },
      error: (error) => {
        console.error('Error al cambiar estado:', error);
        this.snackBar.open('Error al cambiar el estado', 'Cerrar', {
          duration: 3000,
          panelClass: ['error-snackbar']
        });
      }
    });
  }

  eliminarNoticia(noticia: Noticia): void {
    Swal.fire({
      title: '¿Eliminar noticia?',
      text: 'Esta acción no se puede deshacer',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.noticiasService.eliminarNoticia(noticia.id!).subscribe({
          next: (response) => {
            if (response.success) {
              this.snackBar.open('Noticia eliminada', 'Cerrar', {
                duration: 3000
              });
              this.cargarNoticias();
            }
          },
          error: (error) => {
            console.error('Error al eliminar noticia:', error);
            this.snackBar.open('Error al eliminar la noticia', 'Cerrar', {
              duration: 3000,
              panelClass: ['error-snackbar']
            });
          }
        });
      }
    });
  }

  obtenerColorEstado(estado: string): 'primary' | 'accent' | 'warn' {
    switch (estado) {
      case 'publicada': return 'primary';
      case 'borrador': return 'accent';
      case 'archivada': return 'warn';
      default: return 'primary';
    }
  }

  obtenerTextoEstado(estado: string): string {
    switch (estado) {
      case 'publicada': return 'Publicada';
      case 'borrador': return 'Borrador';
      case 'archivada': return 'Archivada';
      default: return estado;
    }
  }

  formatearFecha(fecha: string): string {
    return new Date(fecha).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  onImageError(event: Event): void {
    const target = event.target as HTMLImageElement;
    if (target) {
      target.src = 'assets/images/home/default-news.jpg';
    }
  }
}
